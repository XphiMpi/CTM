<script setup>
import { ref, computed, onMounted } from "vue";

/* Layout */
import Sidebar from "@/components/Sidebar.vue";
import Topbar from "@/components/Topbar.vue";

/* Dashboard */
import AdminDashboard from "@/components/AdminDashboard.vue";
import ParentDashboard from "@/components/ParentDashboard.vue";

/* Management */
import StudentManagement from "@/components/StudentManagement.vue";
import UserManagement from "@/components/UserManagement.vue";
import AttendanceManagement from "@/components/AttendanceManagement.vue";
import RescheduleManagement from "@/components/RescheduleManagement.vue";
import AttendanceModal from "@/components/AttendanceModal.vue";
import UserModal from "@/components/UserModal.vue";
import StudentModal from "@/components/StudentModal.vue";
import RescheduleModal from "@/components/RescheduleModal.vue";
import RescheduleRequest from "@/components/RescheduleRequest.vue";
import RescheduleRequestModal from "@/components/RescheduleRequestModal.vue";
import { createStudent, updateStudent } from "../services/studentService";
import {
  createAttendance,
  updateAttendance,
} from "@/services/attendanceService";
import { createUser, updateUser } from "../services/userService";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
/* Composables */
import { useAuth } from "@/composables/useAuth";
import { useUsers } from "@/composables/useUsers";
import { useStudents } from "@/composables/useStudents";
import { useAttendance } from "@/composables/useAttendance";
import { useReschedule } from "@/composables/useReschedule";
/* state*/
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

const showRescheduleModal = ref(false);
const selectedRequest = ref(null);

const showRequestModal = ref(false);
const openAddRequest = () => {
  showRequestModal.value = true;
};
const saveRequest = async (data) => {
  await addDoc(
    collection(db, "reschedules"),
    {
      studentId:
        userProfile.value.studentId,

      studentName:
        userProfile.value.studentName,

      tanggal: data.tanggal,
      jam: data.jam,
      alasan: data.alasan,

      status: "Menunggu",

      createdAt: serverTimestamp(),
    }
  );

  showRequestModal.value = false;
};


/* -------------------------------- */
/* AUTH */
/* -------------------------------- */

const {
  currentUser,
  userProfile,
  initAuth,
  loading,
  logout: authLogout,
} = useAuth();

/* -------------------------------- */
/* USERS */
/* -------------------------------- */

const { users, totalUsers, subscribeUsers, removeUser } = useUsers();

/* -------------------------------- */
/* STUDENTS */
/* -------------------------------- */

const { students, totalStudents, subscribeStudents, removeStudent } =
  useStudents();

/* -------------------------------- */
/* ATTENDANCE */
/* -------------------------------- */

const { attendance, totalAttendance, subscribeAttendance, deleteAttendance } =
  useAttendance();

/* -------------------------------- */
/* RESCHEDULE */
/* -------------------------------- */

const {
  reschedules,
  pendingCount,
  subscribeReschedule,
  approveReschedule,
  rejectReschedule,
} = useReschedule();

/* -------------------------------- */
/* UI STATE */
/* -------------------------------- */

const activeMenu = ref("Dashboard");

/* -------------------------------- */
/* ROLE */
/* -------------------------------- */

const role = computed(() => {
  return userProfile?.value?.role || "teacher";
});

const roleLabel = computed(() => {
  if (role.value === "admin") {
    return "ADMIN";
  }

  if (role.value === "parent") {
    return "ORANG TUA";
  }

  return "TEACHER";
});

/* -------------------------------- */
/* MENU */
/* -------------------------------- */

const menus = computed(() => {
  if (role.value === "parent") {
    return ["Dashboard", "Reschedule Request"];
  }

  return [
    "Dashboard",
    "Student Management",
    "User Management",
    "Attendance",
    "Reschedule Management",
  ];
});

const myRequests = computed(() => {
  if (!userProfile.value?.studentId) {
    return [];
  }

  return reschedules.value.filter(
    item =>
      item.studentId === userProfile.value.studentId
  );
});
/* -------------------------------- */
/* STATS */
/* -------------------------------- */

const adminStats = computed(() => ({
  students: totalStudents.value,
  users: totalUsers.value,
  attendance: totalAttendance.value,
  pendingReschedule: pendingCount.value,
}));

/* -------------------------------- */
/* EVENTS */
/* -------------------------------- */

const changeMenu = (menu) => {
  activeMenu.value = menu;
};

const deleteStudentHandler = async (id) => {
  const ok = confirm("Hapus student?");

  if (!ok) return;

  await removeStudent(id);
};

const deleteUserHandler = async (id) => {
  const ok = confirm("Hapus user?");

  if (!ok) return;

  await removeUser(id);
};

const deleteAttendanceHandler = async (id) => {
  const ok = confirm("Hapus attendance?");

  if (!ok) return;

  await deleteAttendance(id);
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

const logout = async () => {
  await authLogout();

  localStorage.clear();

  location.href = "/RoleSelect";
};

/* -------------------------------- */
/* INIT */
/* -------------------------------- */

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

        <!-- ADMIN DASHBOARD -->

        <AdminDashboard
          v-if="role === 'admin' && activeMenu === 'Dashboard'"
          :stats="adminStats"
        />

        <!-- PARENT DASHBOARD -->

        <ParentDashboard
          v-if="role === 'parent' && activeMenu === 'Dashboard'"
          :attendance="attendance"
          :children="students"
        />

        <!-- STUDENT -->

        <StudentManagement
          v-if="activeMenu === 'Student Management'"
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

        <!-- USER -->

        <UserManagement
          v-if="activeMenu === 'User Management'"
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

        <!-- ATTENDANCE -->

        <!-- ATTENDANCE -->

        <AttendanceManagement
          v-if="activeMenu === 'Attendance'"
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

        <!-- RESCHEDULE -->

        <RescheduleManagement
          v-if="role === 'admin' && activeMenu === 'Reschedule Management'"
          :reschedules="reschedules"
          @approve="approveHandler"
          @reject="rejectHandler"
        />
        <RescheduleRequest
          v-if="role === 'parent' && activeMenu === 'Reschedule Request'"
          :requests="myRequests"
          @add="openAddRequest"
        />
        <RescheduleRequestModal
          :show="showRequestModal"
          @close="showRequestModal = false"
          @save="saveRequest"
        />
      </section>
    </main>
  </div>
</template>
