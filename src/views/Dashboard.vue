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
import RescheduleManagement from "@/components/RescheduleManagement.vue";
import RescheduleModal from "@/components/RescheduleModal.vue";
import RescheduleRequest from "@/components/RescheduleRequest.vue";
import RescheduleRequestModal from "@/components/RescheduleRequestModal.vue";

/* Services & Firebase */
import { uploadImage } from "@/services/cloudinaryService";
import { createStudent, updateStudent } from "@/services/studentService";
import {
  createAttendance,
  updateAttendance,
} from "@/services/attendanceService";
import { createUser, updateUser } from "@/services/userService";
import {
  setDoc,
  updateDoc,
  doc,
  addDoc,
  arrayUnion,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

/* Composables */
import { useAuth } from "@/composables/useAuth";
import { useUsers } from "@/composables/useUsers";
import { useStudents } from "@/composables/useStudents";
import { useAttendance } from "@/composables/useAttendance";
import { useReschedule } from "@/composables/useReschedule";

/* ---------------------------------------------------- */
/* AUTH & USER ROLE                                     */
/* ---------------------------------------------------- */
const {
  currentUser,
  userProfile,
  initAuth,
  loading,
  logout: authLogout,
} = useAuth();

const role = computed(() => userProfile?.value?.role || "teacher");

const roleLabel = computed(() => {
  if (role.value === "admin") return "ADMIN";
  if (role.value === "parent") return "ORANG TUA";
  return "TEACHER";
});

const linkChild = async (studentId) => {
  try {
    const student = students.value.find((item) => item.studentId === studentId);

    if (!student) {
      alert("Student ID tidak ditemukan");
      return;
    }

    await updateDoc(doc(db, "users", userProfile.value.uid), {
      studentIds: arrayUnion(studentId),
    });

    alert("Anak berhasil ditambahkan");
    await initAuth();
  } catch (error) {
    console.error(error);
  }
};

/* ---------------------------------------------------- */
/* COMPOSABLES DATA DATA FETCHING                       */
/* ---------------------------------------------------- */
const { users, totalUsers, subscribeUsers, removeUser } = useUsers();
const { students, totalStudents, subscribeStudents, removeStudent } =
  useStudents();
const { attendance, totalAttendance, subscribeAttendance, deleteAttendance } =
  useAttendance();
const {
  reschedules,
  pendingCount,
  subscribeReschedule,
  approveReschedule,
  rejectReschedule,
} = useReschedule();

/* ---------------------------------------------------- */
/* NAVIGATION & MENU CONFIGURATION                      */
/* ---------------------------------------------------- */
const activeMenu = ref("Dashboard");
const sidebarOpen = ref(false);

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
    "Reschedule Management",
  ];
});

const changeMenu = (menu) => {
  activeMenu.value = menu;
  sidebarOpen.value = false; // tutup sidebar di mobile setelah klik menu
};

const showAddChildModal = ref(false);

/* ---------------------------------------------------- */
/* DASHBOARD STATS                                      */
/* ---------------------------------------------------- */
const activeStudents = computed(
  () => students.value.filter((student) => student.status === "Aktif").length,
);

const adminStats = computed(() => ({
  students: totalStudents.value,
  users: totalUsers.value,
  pendingReschedule: pendingCount.value,
  activeStudents: activeStudents.value,
}));

const teacherStats = computed(() => ({
  students: totalStudents.value,
  attendance: totalAttendance.value,
}));

const myRequests = computed(() => {
  const ids = userProfile.value?.studentIds || [];

  return reschedules.value.filter(
    (item) => ids.includes(item.studentId)
  );
});

/* ---------------------------------------------------- */
/* MODALS HANDLERS                                      */
/* ---------------------------------------------------- */

const saveAttendanceBatch = async (payload) => {
  try {
    let photoUrl = "";

    // Upload foto ke Cloudinary
    if (payload.photo) {
      photoUrl = await uploadImage(payload.photo);
    }

    const attendanceData = payload.attendance || [];

    for (const item of attendanceData) {
      const dataToSave = {
        ...item,

        // Metadata absensi
        kelas: payload.kelas,
        mapel: payload.mapel,
        tanggal: payload.tanggal,

        // Foto & face detection
        photoUrl,
        detectedFaces: payload.detectedFaces,
      };

      if (item.id) {
        await updateAttendance(item.id, dataToSave);
      } else {
        await createAttendance(dataToSave);
      }
    }

    console.log("✅ Attendance saved", {
      photoUrl,
      totalData: attendanceData.length,
      detectedFaces: payload.detectedFaces,
    });

    alert("Data absensi berhasil disimpan");
  } catch (error) {
    console.error("❌ Save Attendance Error:", error);

    alert("Gagal menyimpan absensi");
  }
};

const deleteAttendanceHandler = async (id) => {
  if (confirm("Hapus data presensi ini?")) {
    await deleteAttendance(id);
  }
};

const deleteAttendanceGroup = async ({ kelas, tanggal }) => {
  if (!confirm(`Hapus absensi ${kelas} tanggal ${tanggal}?`)) {
    return;
  }

  const data = attendance.value.filter(
    (item) => item.kelas === kelas && (item.tanggal || item.date) === tanggal,
  );

  console.log("Data ditemukan:", data);

  for (const item of data) {
    if (!item?.id) continue;

    await deleteAttendance(item.id);
  }
};

/* Student Modal */
const myChildren = computed(() => {
  const ids = userProfile.value?.studentIds || [];

  console.log("IDS", ids);

  return students.value.filter((student) => {
    console.log("cek", student.studentId, ids.includes(student.studentId));

    return ids.includes(student.studentId);
  });
});

const myAttendance = computed(() => {
  const ids = userProfile.value?.studentIds || [];

  if (ids.length) {
    return attendance.value.filter((item) => ids.includes(item.studentId));
  }

  return attendance.value.filter(
    (item) => item.studentId === userProfile.value?.studentId,
  );
});

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

const openEditUser = (user) => {
  selectedUser.value = user;
  showUserModal.value = true;
};

const saveUser = async (data) => {
  try {
    if (data.id) {
      await updateUser(data.id, {
        nama: data.nama,
        email: data.email,
        phone: data.phone,
        role: data.role,
      });
    } else {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );

      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,

        nama: data.nama,
        email: data.email,
        phone: data.phone,
        role: data.role,

        status: "active",

        createdAt: serverTimestamp(),
      });
    }

    showUserModal.value = false;
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

const deleteUserHandler = async (id) => {
  if (!confirm("Nonaktifkan akun ini?")) return;

  await updateUser(id, {
    status: "inactive",
  });
};

/* Reschedule Modal */
const showRescheduleModal = ref(false);
const selectedRequest = ref(null);
const showRequestModal = ref(false);

const openAddRequest = () => {
  showRequestModal.value = true;
};

const saveRequest = async (data) => {
  const child = myChildren.value.find(
    (item) => item.studentId === data.studentId,
  );

  await addDoc(collection(db, "reschedules"), {
    studentId: child.studentId,
    studentName: child.nama,
    tanggal: data.tanggal,
    jam: data.jam,
    alasan: data.alasan,
    status: "Menunggu",
    createdAt: serverTimestamp(),
  });
};

const approveHandler = (item) => {
  selectedRequest.value = item;
  showRescheduleModal.value = true;
};

const approveDirect = async (item) => {
  try {
    await approveReschedule(item.id, {
      tanggal: item.tanggal,
      jam: item.jam,
      catatan: "Disetujui admin",
    });
  } catch (error) {
    console.error("Gagal approve:", error);
  }
};

const saveApproval = async (payload) => {
  await approveReschedule(
    selectedRequest.value.id,
    {
      tanggal: payload.tanggal,
      jam: payload.jam,
    }
  );

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
  <div class="flex h-dvh bg-[#f1f2fb]">
    <!-- SIDEBAR -->
    <Sidebar
      :menus="menus"
      :activeMenu="activeMenu"
      :role-label="roleLabel"
      :isOpen="sidebarOpen"
      @change-menu="changeMenu"
      @logout="logout"
      @close="sidebarOpen = false"
    />

    <!-- MAIN CONTENT -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- Mobile Header -->
      <Topbar
        :user="userProfile"
        :role-label="roleLabel"
        @toggle-sidebar="sidebarOpen = true"
      />

      <section class="flex-1 overflow-y-auto p-6">
        <div v-if="loading" class="text-center py-10">Loading...</div>

        <template v-else>
          <!-- DASHBOARD VIEWS -->
          <AdminDashboard
            v-if="role === 'admin' && activeMenu === 'Dashboard'"
            :stats="adminStats"
            :users="users"
            :students="students"
          />

          <TeacherDashboard
            v-if="role === 'teacher' && activeMenu === 'Dashboard'"
            :stats="teacherStats"
            :attendance-list="attendance"
            :student-list="students"
            @open-absensi="changeMenu('Student presence')"
            @delete-attendance="deleteAttendanceGroup"
          />

          <ParentDashboard
            v-if="role === 'parent' && activeMenu === 'Dashboard'"
            :attendance="myAttendance"
            :children="myChildren"
            @save-child="linkChild"
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
          <template
            v-if="
              activeMenu === 'Student presence' || activeMenu === 'Attendance'
            "
          >
            <AttendanceManagement
              :students="students"
              :attendance="attendance"
              @save-batch="saveAttendanceBatch"
            />
          </template>

          <!-- RESCHEDULE MANAGEMENT (Admin) -->
          <template v-if="activeMenu === 'Reschedule Management'">
            <RescheduleManagement
              :reschedules="reschedules"
              @approve="approveDirect"
              @edit-schedule="approveHandler"
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
            <RescheduleRequest :requests="myRequests" @add="openAddRequest" />
            <RescheduleRequestModal
              :show="showRequestModal"
              :children="myChildren"
              @close="showRequestModal = false"
              @save="saveRequest"
            />
          </template>
        </template>
      </section>
    </main>
  </div>
</template>
