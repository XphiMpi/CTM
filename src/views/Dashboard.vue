<script setup>
import { ref, computed, onMounted } from "vue";

/* Layout */
import Sidebar from "@/components/Sidebar.vue";
import Topbar from "@/components/Topbar.vue";

/* Dashboard */
import AdminDashboard from "@/components/AdminDashboard.vue";
import ParentDashboard from "@/components/ParentDashboard.vue";
import TeacherDashboard from "@/components/TeacherDashboard.vue";

/* Management & Modals */
import StudentManagement from "@/components/StudentManagement.vue";
import UserManagement from "@/components/UserManagement.vue";
import AttendanceManagement from "@/components/AttendanceManagement.vue";
import RescheduleManagement from "@/components/RescheduleManagement.vue";

import AttendanceModal from "@/components/AttendanceModal.vue";
import UserModal from "@/components/UserModal.vue";
import StudentModal from "@/components/StudentModal.vue";
import RescheduleModal from "@/components/RescheduleModal.vue";

/* Services */
import { createStudent, updateStudent } from "../services/studentService";
import { createAttendance, updateAttendance } from "@/services/attendanceService";
import { createUser, updateUser } from "../services/userService";

/* Composables */
import { useAuth } from "@/composables/useAuth";
import { useUsers } from "@/composables/useUsers";
import { useStudents } from "@/composables/useStudents";
import { useAttendance } from "@/composables/useAttendance";
import { useReschedule } from "@/composables/useReschedule";

/* -------------------------------- */
/* AUTH & ROLE */
/* -------------------------------- */
const { currentUser, userProfile, initAuth, loading, logout: authLogout } = useAuth();

const role = computed(() => {
  return userProfile?.value?.role || "teacher";
});

const roleLabel = computed(() => {
  if (role.value === "admin") return "ADMIN";
  if (role.value === "parent") return "ORANG TUA";
  return "TEACHER";
});

/* -------------------------------- */
/* MENU CONFIGURATION */
/* -------------------------------- */
const activeMenu = ref("Dashboard");

const menus = computed(() => {
  if (role.value === "parent") {
    return ["Dashboard", "Student presence", "Reschedule"];
  }

  // Teacher hanya punya Dashboard & Student presence
  if (role.value === "teacher") {
    return ["Dashboard", "Student presence"];
  }

  // Role Admin
  return [
    "Dashboard",
    "Student Management",
    "User Management",
    "Student presence",
    "Reschedule",
  ];
});

/* -------------------------------- */
/* DATA FETCHING & COMPOSABLES */
/* -------------------------------- */
const { users, totalUsers, subscribeUsers, removeUser } = useUsers();
const { students, totalStudents, subscribeStudents, removeStudent } = useStudents();
const { attendance, totalAttendance, subscribeAttendance, deleteAttendance } = useAttendance();
const { reschedules, pendingCount, subscribeReschedule, approveReschedule, rejectReschedule } = useReschedule();

/* -------------------------------- */
/* STATS */
/* -------------------------------- */
const adminStats = computed(() => ({
  students: totalStudents.value,
  users: totalUsers.value,
  attendance: totalAttendance.value,
  pendingReschedule: pendingCount.value,
}));

// Stats khusus Teacher (Tanpa Reschedule)
const teacherStats = computed(() => ({
  students: totalStudents.value,
  attendance: totalAttendance.value,
}));

/* -------------------------------- */
/* MODAL STATES & HANDLERS */
/* -------------------------------- */

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
  const ok = confirm("Hapus data presensi?");
  if (!ok) return;
  await deleteAttendance(id);
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
    console.error(error);
  }
};

const deleteStudentHandler = async (id) => {
  const ok = confirm("Hapus student?");
  if (!ok) return;
  await removeStudent(id);
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
    console.error(error);
  }
};

const deleteUserHandler = async (id) => {
  const ok = confirm("Hapus user?");
  if (!ok) return;
  await removeUser(id);
};

/* Reschedule Modal & Handlers */
const showRescheduleModal = ref(false);
const selectedRequest = ref(null);

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

/* Navigation & Auth Handlers */
const changeMenu = (menu) => {
  activeMenu.value = menu;
};

const logout = async () => {
  await authLogout();
  localStorage.clear();
  location.href = "/RoleSelect";
};

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

    <!-- CONTENT -->
    <main class="flex-1 flex flex-col">
      <Topbar :user="userProfile" :role-label="roleLabel" />

      <section class="flex-1 overflow-y-auto p-6">
        <div v-if="loading" class="text-center">Loading...</div>

        <template v-else>
          <!-- ADMIN DASHBOARD -->
          <AdminDashboard
            v-if="role === 'admin' && activeMenu === 'Dashboard'"
            :stats="adminStats"
          />

          <!-- TEACHER DASHBOARD -->
          <TeacherDashboard
            v-if="role === 'teacher' && activeMenu === 'Dashboard'"
            :stats="teacherStats"
            :attendance-list="attendance"
            :student-list="students"
            @open-absensi="changeMenu('Student presence')"
          />

          <!-- PARENT DASHBOARD -->
          <ParentDashboard
            v-if="role === 'parent' && activeMenu === 'Dashboard'"
            :attendance="attendance"
            :children="students"
          />

          <!-- STUDENT MANAGEMENT (Admin only) -->
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

          <!-- USER MANAGEMENT (Admin only) -->
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

          <!-- STUDENT PRESENCE / ATTENDANCE -->
          <template v-if="activeMenu === 'Student presence'">
            <AttendanceManagement
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

          <!-- RESCHEDULE (Admin & Parent only) -->
          <template v-if="activeMenu === 'Reschedule'">
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
        </template>
      </section>
    </main>
  </div>
</template>