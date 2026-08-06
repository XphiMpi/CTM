<script setup>
import { ref, computed, onMounted } from "vue";

/* Layout */
import Sidebar from "@/components/Sidebar.vue";
import Topbar from "@/components/Topbar.vue";

/* Dashboard Views */
import AdminDashboard from "@/components/AdminDashboard.vue";
import ParentDashboard from "@/components/ParentDashboard.vue";
import TeacherDashboard from "@/components/TeacherDashboard.vue";

/* Management Components & Modals */
import StudentManagement from "@/components/StudentManagement.vue";
import StudentModal from "@/components/StudentModal.vue";
import UserManagement from "@/components/UserManagement.vue";
import UserModal from "@/components/UserModal.vue";
import AttendanceManagement from "@/components/AttendanceManagement.vue";
import AttendanceModal from "@/components/AttendanceModal.vue";
import RescheduleManagement from "@/components/RescheduleManagement.vue";
import RescheduleModal from "@/components/RescheduleModal.vue";
import RescheduleRequest from "@/components/RescheduleRequest.vue";
import RescheduleRequestModal from "@/components/RescheduleRequestModal.vue";

/* Services & Firebase */
import { createStudent, updateStudent } from "@/services/studentService";
import { createAttendance, updateAttendance } from "@/services/attendanceService";
import { createUser, updateUser } from "@/services/userService";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/firebase"; // PATH SESUAI DENGAN EXPLORER ANDA

/* Composables */
import { useAuth } from "@/composables/useAuth";
import { useUsers } from "@/composables/useUsers";
import { useStudents } from "@/composables/useStudents";
import { useAttendance } from "@/composables/useAttendance";
import { useReschedule } from "@/composables/useReschedule";

/* ---------------------------------------------------- */
/* AUTH & USER ROLE                                     */
/* ---------------------------------------------------- */
const { currentUser, userProfile, initAuth, loading, logout: authLogout } = useAuth();

const role = computed(() => userProfile?.value?.role || "teacher");

const roleLabel = computed(() => {
  if (role.value === "admin") return "ADMIN";
  if (role.value === "parent") return "ORANG TUA";
  return "TEACHER";
});

/* ---------------------------------------------------- */
/* COMPOSABLES DATA DATA FETCHING                       */
/* ---------------------------------------------------- */
const { users, totalUsers, subscribeUsers, removeUser } = useUsers();
const { students, totalStudents, subscribeStudents, removeStudent } = useStudents();
const { attendance, totalAttendance, subscribeAttendance, deleteAttendance } = useAttendance();
const { reschedules, pendingCount, subscribeReschedule, approveReschedule, rejectReschedule } = useReschedule();

/* ---------------------------------------------------- */
/* NAVIGATION & MENU CONFIGURATION                      */
/* ---------------------------------------------------- */
const activeMenu = ref("Dashboard");

const menus = computed(() => {
  if (role.value === "parent") {
    return ["Dashboard", "Reschedule Request"];
  }
  if (role.value === "teacher") {
    return ["Dashboard", "Student presence"];
  }
  return [
    "Dashboard",
    "Student Management",
    "User Management",
    "Student presence",
    "Reschedule Management",
  ];
});

const changeMenu = (menu) => {
  activeMenu.value = menu;
};

/* ---------------------------------------------------- */
/* DASHBOARD STATS                                      */
/* ---------------------------------------------------- */
const adminStats = computed(() => ({
  students: totalStudents.value,
  users: totalUsers.value,
  attendance: totalAttendance.value,
  pendingReschedule: pendingCount.value,
}));

const teacherStats = computed(() => ({
  students: totalStudents.value,
  attendance: totalAttendance.value,
}));

const myRequests = computed(() => {
  if (!userProfile.value?.studentId) return [];
  return reschedules.value.filter(
    (item) => item.studentId === userProfile.value.studentId
  );
});

/* ---------------------------------------------------- */
/* MODALS HANDLERS                                      */
/* ---------------------------------------------------- */
/* Attendance Modal */
const showAttendanceModal = ref(false);
const selectedAttendance = ref(null);

const openAddAttendance = () => {
  selectedAttendance.value = null;
  showAttendanceModal.value = true;
};

const openEditAttendance = (item) => {
  selectedAttendance.value = item;
  showAttendanceModal.value = true;
};

const saveAttendance = async (data) => {
  if (data.id) {
    await updateAttendance(data.id, data);
  } else {
    await createAttendance(data);
  }
  showAttendanceModal.value = false;
};

const deleteAttendanceHandler = async (id) => {
  if (confirm("Hapus data presensi ini?")) {
    await deleteAttendance(id);
  }
};

/* Student Modal */
const showStudentModal = ref(false);
const selectedStudent = ref(null);

const openAddStudent = () => {
  selectedStudent.value = null;
  showStudentModal.value = true;
};

const openEditStudent = (student) => {
  selectedStudent.value = student;
  showStudentModal.value = true;
};

const saveStudent = async (data) => {
  try {
    if (data.id) {
      await updateStudent(data.id, data);
    } else {
      await createStudent(data);
    }
    showStudentModal.value = false;
  } catch (error) {
    console.error("Gagal menyimpan student:", error);
  }
};

const deleteStudentHandler = async (id) => {
  if (confirm("Hapus siswa ini?")) {
    await removeStudent(id);
  }
};

/* User Modal */
const showUserModal = ref(false);
const selectedUser = ref(null);

const openAddUser = () => {
  selectedUser.value = null;
  showUserModal.value = true;
};

const openEditUser = (user) => {
  selectedUser.value = user;
  showUserModal.value = true;
};

const saveUser = async (data) => {
  try {
    if (data.id) {
      await updateUser(data.id, data);
    } else {
      const id = crypto.randomUUID();
      await createUser(id, data);
    }
    showUserModal.value = false;
  } catch (error) {
    console.error("Gagal menyimpan user:", error);
  }
};

const deleteUserHandler = async (id) => {
  if (confirm("Hapus user ini?")) {
    await removeUser(id);
  }
};

/* Reschedule Modal */
const showRescheduleModal = ref(false);
const selectedRequest = ref(null);
const showRequestModal = ref(false);

const openAddRequest = () => {
  showRequestModal.value = true;
};

const saveRequest = async (data) => {
  await addDoc(collection(db, "reschedules"), {
    studentId: userProfile.value?.studentId || "",
    studentName: userProfile.value?.studentName || "",
    tanggal: data.tanggal,
    jam: data.jam,
    alasan: data.alasan,
    status: "Menunggu",
    createdAt: serverTimestamp(),
  });
  showRequestModal.value = false;
};

const approveHandler = (item) => {
  selectedRequest.value = item;
  showRescheduleModal.value = true;
};

const saveApproval = async (payload) => {
  await approveReschedule(payload.requestId, {
    tanggal: payload.tanggalPengganti,
    jam: payload.jamPengganti,
    kelas: payload.kelasPengganti,
    catatan: payload.catatan,
  });
  showRescheduleModal.value = false;
};

const rejectHandler = async (id) => {
  await rejectReschedule(id);
};

/* Logout */
const logout = async () => {
  await authLogout();
  localStorage.clear();
  location.href = "/RoleSelect";
};

/* ---------------------------------------------------- */
/* LIFECYCLE                                            */
/* ---------------------------------------------------- */
onMounted(() => {
  initAuth();
  subscribeUsers();
  subscribeStudents();
  subscribeAttendance();
  subscribeReschedule();
});
</script>

<template>
  <div class="flex h-screen bg-[#f1f2fb]">
    <!-- SIDEBAR -->
    <Sidebar
      :menus="menus"
      :activeMenu="activeMenu"
      :role-label="roleLabel"
      @change-menu="changeMenu"
      @logout="logout"
    />

    <!-- MAIN CONTENT -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <Topbar :user="userProfile" :role-label="roleLabel" />

      <section class="flex-1 overflow-y-auto p-6">
        <div v-if="loading" class="text-center py-10">Loading...</div>

        <template v-else>
          <!-- DASHBOARD VIEWS -->
          <AdminDashboard
            v-if="role === 'admin' && activeMenu === 'Dashboard'"
            :stats="adminStats"
          />

          <TeacherDashboard
            v-if="role === 'teacher' && activeMenu === 'Dashboard'"
            :stats="teacherStats"
            :attendance-list="attendance"
            :student-list="students"
            @open-absensi="changeMenu('Student presence')"
          />

          <ParentDashboard
            v-if="role === 'parent' && activeMenu === 'Dashboard'"
            :attendance="attendance"
            :children="students"
          />

          <!-- STUDENT MANAGEMENT (Admin Only) -->
          <template v-if="activeMenu === 'Student Management'">
            <StudentManagement
              :students="students"
              @add="openAddStudent"
              @edit="openEditStudent"
              @delete="deleteStudentHandler"
            />
            <StudentModal
              :show="showStudentModal"
              :student="selectedStudent"
              @close="showStudentModal = false"
              @save="saveStudent"
            />
          </template>

          <!-- USER MANAGEMENT (Admin Only) -->
          <template v-if="activeMenu === 'User Management'">
            <UserManagement
              :users="users"
              @add="openAddUser"
              @edit="openEditUser"
              @delete="deleteUserHandler"
            />
            <UserModal
              :show="showUserModal"
              :user="selectedUser"
              @close="showUserModal = false"
              @save="saveUser"
            />
          </template>

          <!-- ATTENDANCE / STUDENT PRESENCE -->
          <template v-if="activeMenu === 'Student presence' || activeMenu === 'Attendance'">
            <AttendanceManagement
              :students="students"
              :attendance="attendance"
              @add="openAddAttendance"
              @edit="openEditAttendance"
              @delete="deleteAttendanceHandler"
            />
            <AttendanceModal
              :show="showAttendanceModal"
              :attendance="selectedAttendance"
              :students="students"
              @close="showAttendanceModal = false"
              @save="saveAttendance"
            />
          </template>

          <!-- RESCHEDULE MANAGEMENT (Admin) -->
          <template v-if="activeMenu === 'Reschedule Management'">
            <RescheduleManagement
              :reschedules="reschedules"
              @approve="approveHandler"
              @reject="rejectHandler"
            />
            <RescheduleModal
              :show="showRescheduleModal"
              :request="selectedRequest"
              @close="showRescheduleModal = false"
              @save="saveApproval"
            />
          </template>

          <!-- RESCHEDULE REQUEST (Parent) -->
          <template v-if="activeMenu === 'Reschedule Request'">
            <RescheduleRequest
              :requests="myRequests"
              @add="openAddRequest"
            />
            <RescheduleRequestModal
              :show="showRequestModal"
              @close="showRequestModal = false"
              @save="saveRequest"
            />
          </template>
        </template>
      </section>
    </main>
  </div>
</template>