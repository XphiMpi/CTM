<script setup>
import { ref, computed, onMounted } from 'vue'

/*
|--------------------------------------------------------------------------
| CTM - Dashboard.vue
|--------------------------------------------------------------------------
| Satu dashboard untuk:
| - Admin
| - Teacher
| - Orang Tua
|
| Role dibaca dari localStorage:
| localStorage.setItem('role', 'admin')
| localStorage.setItem('role', 'teacher')
| localStorage.setItem('role', 'orang_tua')
|
| Untuk production, data di bawah nantinya diganti dengan API/backend.
|--------------------------------------------------------------------------
*/

const role = ref('admin')
const activeMenu = ref('Dashboard')

const user = ref({
  nama: 'Nama User',
  email: 'user@ctm.com'
})

/* =========================
   DATA SISWA
========================= */

const students = ref([
  { id: 'STD001', nama: 'Ahmad Rizky', kelas: 'SMP 3', status: 'Aktif' },
  { id: 'STD002', nama: 'Siti Aisyah', kelas: 'SMP 2', status: 'Aktif' },
  { id: 'STD003', nama: 'Budi Santoso', kelas: 'SD 1', status: 'Aktif' },
  { id: 'STD004', nama: 'Citra Lestari', kelas: 'TK B', status: 'Aktif' }
])

/* =========================
   DATA USER
========================= */

const users = ref([
  { id: 1, nama: 'Budi Santoso', email: 'budi@ctm.com', role: 'Teacher', status: 'Aktif' },
  { id: 2, nama: 'Siti', email: 'siti@ctm.com', role: 'Parent', status: 'Aktif' },
  { id: 3, nama: 'Admin CTM', email: 'admin@ctm.com', role: 'Admin', status: 'Aktif' }
])

/* =========================
   DATA ABSENSI
========================= */

const attendance = ref([
  { id: 1, siswa: 'Ahmad Rizky', kelas: 'SMP 3', tanggal: '06-08-2026', status: 'Hadir' },
  { id: 2, siswa: 'Siti Aisyah', kelas: 'SMP 2', tanggal: '06-08-2026', status: 'Izin' },
  { id: 3, siswa: 'Budi Santoso', kelas: 'SD 1', tanggal: '06-08-2026', status: 'Hadir' },
  { id: 4, siswa: 'Citra Lestari', kelas: 'TK B', tanggal: '06-08-2026', status: 'Alfa' },
  { id: 5, siswa: 'Ahmad Rizky', kelas: 'SMP 3', tanggal: '05-08-2026', status: 'Hadir' }
])

/* =========================
   DATA RESCHEDULE
========================= */

const rescheduleRequests = ref([
  {
    id: 1,
    parent: 'Siti',
    student: 'Ahmad Rizky',
    kelasLama: 'SMP 3 - Senin 10:00',
    alasan: 'Ada keperluan keluarga',
    tanggalPengajuan: '06-08-2026',
    status: 'Menunggu',
    jadwalPengganti: ''
  },
  {
    id: 2,
    parent: 'Budi',
    student: 'Citra Lestari',
    kelasLama: 'TK B - Selasa 09:00',
    alasan: 'Tidak dapat hadir',
    tanggalPengajuan: '05-08-2026',
    status: 'Menunggu',
    jadwalPengganti: ''
  }
])

/* =========================
   DATA ORANG TUA
========================= */

const children = ref([
  {
    id: 'STD001',
    nama: 'Ahmad Rizky',
    kelas: 'SMP 3',
    nis: '20260031'
  }
])

const childIdInput = ref('')

const selectedChildId = ref('STD001')

const parentAttendance = ref([
  { tanggal: '06-08-2026', mapel: 'Matematika', status: 'Hadir' },
  { tanggal: '05-08-2026', mapel: 'IPA', status: 'Hadir' },
  { tanggal: '04-08-2026', mapel: 'Bahasa Indonesia', status: 'Izin' },
  { tanggal: '03-08-2026', mapel: 'Bahasa Inggris', status: 'Hadir' },
  { tanggal: '01-08-2026', mapel: 'Matematika', status: 'Alfa' }
])

const replacementHistory = ref([
  {
    id: 1,
    anak: 'Ahmad Rizky',
    kelasLama: 'SMP 3 - Senin 10:00',
    jadwalBaru: 'SMP 3 - Rabu 13:00',
    status: 'Disetujui',
    tanggal: '01-08-2026'
  }
])

/* =========================
   DATA TEACHER
========================= */

const teacherClasses = ref([
  { nama: 'SD 1', siswa: 30, hadir: 28, izin: 1, alfa: 1 },
  { nama: 'SMP 3', siswa: 30, hadir: 25, izin: 3, alfa: 2 },
  { nama: 'TK B', siswa: 30, hadir: 30, izin: 0, alfa: 0 }
])

const teacherTasks = ref([
  { id: 1, text: 'Input nilai kelas SMP 2', selesai: true },
  { id: 2, text: 'Rekap absensi bulan Mei', selesai: false },
  { id: 3, text: 'Koreksi tugas kelas SMA 1', selesai: false },
  { id: 4, text: 'Input nilai kelas SD 3', selesai: true }
])

/* =========================
   FORM
========================= */

const showAddStudent = ref(false)
const showAddUser = ref(false)
const showEditAttendance = ref(false)
const showRescheduleForm = ref(false)

const studentForm = ref({
  id: '',
  nama: '',
  kelas: '',
  status: 'Aktif'
})

const userForm = ref({
  nama: '',
  email: '',
  role: 'Teacher',
  status: 'Aktif'
})

const editAttendanceForm = ref({
  id: null,
  siswa: '',
  kelas: '',
  tanggal: '',
  status: 'Hadir'
})

const parentRescheduleForm = ref({
  childId: 'STD001',
  kelasLama: '',
  alasan: ''
})

/* =========================
   INITIALIZATION
========================= */

onMounted(() => {
  const savedRole =
    localStorage.getItem('role') ||
    localStorage.getItem('userRole') ||
    localStorage.getItem('user_role')

  if (savedRole) {
    role.value = normalizeRole(savedRole)
  }

  const savedName = localStorage.getItem('nama')
  const savedEmail = localStorage.getItem('email')

  if (savedName) user.value.nama = savedName
  if (savedEmail) user.value.email = savedEmail

  if (role.value === 'parent') {
    role.value = 'orang_tua'
  }

  if (role.value === 'orang_tua') {
    activeMenu.value = 'Kehadiran Anak'
  } else if (role.value === 'admin') {
    activeMenu.value = 'Dashboard'
  } else {
    activeMenu.value = 'Dashboard'
  }
})

/* =========================
   ROLE
========================= */

function normalizeRole(value) {
  const r = String(value).toLowerCase().trim()

  if (r === 'admin' || r === 'administrator') return 'admin'
  if (
    r === 'orang tua' ||
    r === 'orangtua' ||
    r === 'orang_tua' ||
    r === 'parent'
  ) {
    return 'orang_tua'
  }

  return 'teacher'
}

function changeRole(newRole) {
  role.value = newRole
  localStorage.setItem('role', newRole)

  if (newRole === 'orang_tua') {
    activeMenu.value = 'Kehadiran Anak'
  } else {
    activeMenu.value = 'Dashboard'
  }
}

/* =========================
   MENU
========================= */

const menus = computed(() => {
  if (role.value === 'admin') {
    return [
      'Dashboard',
      'Student Management',
      'User Management',
      'List Absensi',
      'Reschedule'
    ]
  }

  if (role.value === 'teacher') {
    return [
      'Dashboard',
      'Student Management',
      'User Management',
      'List Absensi',
      'Reschedule'
    ]
  }

  return [
    'Kehadiran Anak',
    'Profile Anak',
    'Pengajuan Kelas Pengganti',
    'Riwayat Kelas Pengganti'
  ]
})

const roleLabel = computed(() => {
  if (role.value === 'admin') return 'ADMIN'
  if (role.value === 'teacher') return 'TEACHER'
  return 'ORANG TUA'
})

const pageTitle = computed(() => {
  if (role.value === 'admin') return 'Dashboard Admin'
  if (role.value === 'teacher') return 'Dashboard Teacher'
  return 'Dashboard Orang Tua'
})

function openMenu(menu) {
  activeMenu.value = menu
}

/* =========================
   DATE
========================= */

const currentDate = computed(() => {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date())
})

/* =========================
   ADMIN STATISTICS
========================= */

const adminStats = computed(() => ({
  students: students.value.length,
  users: users.value.length,
  attendance: attendance.value.length,
  pendingReschedule: rescheduleRequests.value.filter(
    item => item.status === 'Menunggu'
  ).length
}))

/* =========================
   TEACHER STATISTICS
========================= */

const teacherStats = computed(() => {
  const totalStudents = teacherClasses.value.reduce(
    (total, item) => total + item.siswa,
    0
  )

  const totalHadir = teacherClasses.value.reduce(
    (total, item) => total + item.hadir,
    0
  )

  const totalAll = teacherClasses.value.reduce(
    (total, item) => total + item.hadir + item.izin + item.alfa,
    0
  )

  return {
    kelas: teacherClasses.value.length,
    siswa: totalStudents,
    jam: 24,
    kehadiran: totalAll
      ? Math.round((totalHadir / totalAll) * 100)
      : 0
  }
})

/* =========================
   PARENT STATISTICS
========================= */

const selectedChild = computed(() => {
  return children.value.find(
    child => child.id === selectedChildId.value
  ) || children.value[0]
})

const parentStats = computed(() => {
  const hadir = parentAttendance.value.filter(
    item => item.status === 'Hadir'
  ).length

  const izin = parentAttendance.value.filter(
    item => item.status === 'Izin'
  ).length

  const alfa = parentAttendance.value.filter(
    item => item.status === 'Alfa'
  ).length

  const total = hadir + izin + alfa

  return {
    hadir,
    izin,
    alfa,
    persentase: total
      ? Math.round((hadir / total) * 100)
      : 0
  }
})

/* =========================
   STUDENT CRUD
========================= */

function resetStudentForm() {
  studentForm.value = {
    id: '',
    nama: '',
    kelas: '',
    status: 'Aktif'
  }
}

function addStudent() {
  if (
    !studentForm.value.id ||
    !studentForm.value.nama ||
    !studentForm.value.kelas
  ) {
    alert('ID, nama, dan kelas wajib diisi.')
    return
  }

  const exists = students.value.some(
    item => item.id === studentForm.value.id
  )

  if (exists) {
    alert('ID siswa sudah digunakan.')
    return
  }

  students.value.push({
    ...studentForm.value
  })

  resetStudentForm()
  showAddStudent.value = false
}

function deleteStudent(id) {
  if (!confirm('Hapus data siswa ini?')) return

  students.value = students.value.filter(
    item => item.id !== id
  )
}

/* =========================
   USER CRUD
========================= */

function resetUserForm() {
  userForm.value = {
    nama: '',
    email: '',
    role: 'Teacher',
    status: 'Aktif'
  }
}

function addUser() {
  if (!userForm.value.nama || !userForm.value.email) {
    alert('Nama dan email wajib diisi.')
    return
  }

  users.value.push({
    id: Date.now(),
    ...userForm.value
  })

  resetUserForm()
  showAddUser.value = false
}

function deleteUser(id) {
  if (!confirm('Hapus user ini?')) return

  users.value = users.value.filter(
    item => item.id !== id
  )
}

/* =========================
   ATTENDANCE CRUD
========================= */

function openEditAttendance(item) {
  editAttendanceForm.value = {
    ...item
  }

  showEditAttendance.value = true
}

function saveAttendance() {
  const index = attendance.value.findIndex(
    item => item.id === editAttendanceForm.value.id
  )

  if (index !== -1) {
    attendance.value[index] = {
      ...editAttendanceForm.value
    }
  }

  showEditAttendance.value = false
}

function deleteAttendance(id) {
  if (!confirm('Hapus data absensi ini?')) return

  attendance.value = attendance.value.filter(
    item => item.id !== id
  )
}

/* =========================
   RESCHEDULE ADMIN/TEACHER
========================= */

const selectedReschedule = ref(null)

const replacementForm = ref({
  tanggal: '',
  jam: '',
  guru: '',
  kelas: ''
})

function openReschedule(request) {
  selectedReschedule.value = request
  replacementForm.value = {
    tanggal: '',
    jam: '',
    guru: '',
    kelas: ''
  }
  showRescheduleForm.value = true
}

function approveReschedule() {
  if (!selectedReschedule.value) return

  if (
    !replacementForm.value.tanggal ||
    !replacementForm.value.jam ||
    !replacementForm.value.guru ||
    !replacementForm.value.kelas
  ) {
    alert('Lengkapi jadwal kelas pengganti.')
    return
  }

  selectedReschedule.value.status = 'Disetujui'

  selectedReschedule.value.jadwalPengganti =
    `${replacementForm.value.kelas} - ${replacementForm.value.tanggal} ${replacementForm.value.jam} - ${replacementForm.value.guru}`

  showRescheduleForm.value = false
  selectedReschedule.value = null
}

function rejectReschedule(request) {
  if (!confirm('Tolak pengajuan ini?')) return

  request.status = 'Ditolak'
}

/* =========================
   PARENT: ADD CHILD
========================= */

function addChild() {
  const id = childIdInput.value.trim()

  if (!id) {
    alert('Masukkan ID anak.')
    return
  }

  const student = students.value.find(
    item => item.id === id
  )

  if (!student) {
    alert('ID anak tidak ditemukan.')
    return
  }

  const exists = children.value.some(
    child => child.id === id
  )

  if (exists) {
    alert('Anak sudah terhubung dengan akun ini.')
    return
  }

  children.value.push({
    id: student.id,
    nama: student.nama,
    kelas: student.kelas,
    nis: student.id
  })

  childIdInput.value = ''
}

/* =========================
   PARENT: RESCHEDULE
========================= */

function submitParentReschedule() {
  const form = parentRescheduleForm.value

  if (!form.childId || !form.kelasLama || !form.alasan) {
    alert('Lengkapi semua data pengajuan.')
    return
  }

  const child = children.value.find(
    item => item.id === form.childId
  )

  if (!child) {
    alert('Anak tidak ditemukan.')
    return
  }

  rescheduleRequests.value.unshift({
    id: Date.now(),
    parent: user.value.nama,
    student: child.nama,
    kelasLama: form.kelasLama,
    alasan: form.alasan,
    tanggalPengajuan: new Date().toLocaleDateString('id-ID'),
    status: 'Menunggu',
    jadwalPengganti: ''
  })

  alert('Pengajuan kelas pengganti berhasil dikirim.')

  parentRescheduleForm.value = {
    childId: child.id,
    kelasLama: '',
    alasan: ''
  }
}

/* =========================
   LOGOUT
========================= */

function logout() {
  localStorage.removeItem('role')
  localStorage.removeItem('userRole')
  localStorage.removeItem('user_role')
  localStorage.removeItem('nama')
  localStorage.removeItem('email')

  window.location.href = '/login'
}
</script>


<template>
  <div class="flex h-screen bg-[#f1f2fb] text-gray-900 overflow-hidden">

    <!-- =====================================================
         SIDEBAR
    ====================================================== -->
    <aside
      class="w-[220px] shrink-0 bg-gradient-to-b from-[#123fc4] to-[#06216d] text-white flex flex-col"
    >

      <!-- LOGO -->
      <div class="px-5 pt-5 pb-6">
        <div class="flex items-start gap-3">
          <div class="text-[#ffd12e] mt-1">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z"/>
              <path d="M4 5.5v16"/>
            </svg>
          </div>

          <div>
            <div class="text-[13px] font-semibold leading-4">
              Course
            </div>
            <div class="text-[13px] font-semibold leading-4">
              Teacher
            </div>
            <div class="text-[13px] font-semibold text-[#ffd12e] leading-4">
              Management
            </div>
          </div>
        </div>
      </div>

      <!-- ROLE -->
      <div class="px-5 mb-4">
        <div
          class="h-8 rounded-full bg-[#f5b915] text-black flex items-center justify-center text-[10px] font-bold"
        >
          {{ roleLabel }}
        </div>
      </div>

      <!-- MENU -->
      <nav class="px-3 space-y-1.5 flex-1 overflow-y-auto">
        <button
          v-for="menu in menus"
          :key="menu"
          @click="openMenu(menu)"
          class="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-[11px] transition"
          :class="
            activeMenu === menu
              ? 'bg-[#f5b915] text-black shadow-sm'
              : 'text-white hover:bg-white/10'
          "
        >
          <span class="w-5 text-center">
            <template v-if="menu === 'Dashboard'">⌂</template>
            <template v-else-if="menu === 'Student Management'">♙</template>
            <template v-else-if="menu === 'User Management'">♧</template>
            <template v-else-if="menu === 'List Absensi'">✓</template>
            <template v-else-if="menu === 'Reschedule'">↻</template>
            <template v-else-if="menu === 'Kehadiran Anak'">✓</template>
            <template v-else-if="menu === 'Profile Anak'">♙</template>
            <template v-else-if="menu === 'Pengajuan Kelas Pengganti'">＋</template>
            <template v-else>↻</template>
          </span>

          {{ menu }}
        </button>
      </nav>

      <!-- LOGOUT -->
      <div class="px-3 pb-4">
        <button
          @click="logout"
          class="w-full h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center gap-3 px-4 text-[11px] transition"
        >
          <span>⇥</span>
          Logout
        </button>
      </div>
    </aside>


    <!-- =====================================================
         MAIN
    ====================================================== -->
    <main class="flex-1 min-w-0 flex flex-col">

      <!-- TOPBAR -->
      <header
        class="h-[60px] shrink-0 bg-white border-b border-gray-100 flex items-center justify-between px-6"
      >
        <div>
          <div class="text-[10px] text-[#108edc]">
            Selamat datang kembali,
          </div>
          <div class="text-[13px] font-semibold">
            {{ user.nama }}
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            class="w-8 h-8 rounded-full bg-[#f4d48b] flex items-center justify-center"
            title="Notifikasi"
          >
            ♧
          </button>

          <div
            class="h-9 min-w-[150px] px-3 rounded-full bg-gray-100 flex items-center gap-2"
          >
            <div
              class="w-7 h-7 rounded-full bg-[#1744c6] text-white flex items-center justify-center text-[10px]"
            >
              {{ user.nama.charAt(0).toUpperCase() }}
            </div>

            <div>
              <div class="text-[9px] font-semibold">
                {{ user.nama }}
              </div>
              <div class="text-[8px] text-[#1744c6]">
                {{ roleLabel }}
              </div>
            </div>
          </div>
        </div>
      </header>


      <!-- CONTENT -->
      <section class="flex-1 overflow-y-auto p-6">

        <!-- PAGE HEADER -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-[22px] font-bold">
              {{ pageTitle }}
            </h1>
            <p class="text-[10px] text-gray-500 mt-1">
              {{ currentDate }} • Course Teacher Management
            </p>
          </div>

          <div class="hidden">
            {{ role }}
          </div>
        </div>


        <!-- =================================================
             ADMIN DASHBOARD
        ================================================== -->
        <template v-if="role === 'admin' && activeMenu === 'Dashboard'">

          <div class="grid grid-cols-4 gap-4 mb-5">

            <div class="bg-white rounded-xl p-5 shadow-sm">
              <p class="text-[10px] text-gray-500">Total Student</p>
              <p class="text-[25px] font-bold mt-2">
                {{ adminStats.students }}
              </p>
              <p class="text-[9px] text-blue-500 mt-2">
                Siswa terdaftar
              </p>
            </div>

            <div class="bg-white rounded-xl p-5 shadow-sm">
              <p class="text-[10px] text-gray-500">Total User</p>
              <p class="text-[25px] font-bold mt-2">
                {{ adminStats.users }}
              </p>
              <p class="text-[9px] text-blue-500 mt-2">
                User sistem
              </p>
            </div>

            <div class="bg-white rounded-xl p-5 shadow-sm">
              <p class="text-[10px] text-gray-500">List Absensi</p>
              <p class="text-[25px] font-bold mt-2">
                {{ adminStats.attendance }}
              </p>
              <p class="text-[9px] text-blue-500 mt-2">
                Data tercatat
              </p>
            </div>

            <div class="bg-white rounded-xl p-5 shadow-sm">
              <p class="text-[10px] text-gray-500">Reschedule</p>
              <p class="text-[25px] font-bold mt-2">
                {{ adminStats.pendingReschedule }}
              </p>
              <p class="text-[9px] text-orange-500 mt-2">
                Menunggu diproses
              </p>
            </div>

          </div>

          <div class="grid grid-cols-2 gap-4">

            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
              <div class="px-5 py-4 border-b">
                <h2 class="text-[13px] font-semibold">
                  Aktivitas Sistem
                </h2>
              </div>

              <div class="p-5 space-y-4">
                <div class="flex gap-3">
                  <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    ✓
                  </div>
                  <div>
                    <p class="text-[10px] font-medium">
                      Sistem berhasil dijalankan
                    </p>
                    <p class="text-[8px] text-gray-400">
                      Aktivitas sistem terbaru
                    </p>
                  </div>
                </div>

                <div class="flex gap-3">
                  <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    +
                  </div>
                  <div>
                    <p class="text-[10px] font-medium">
                      Data student aktif
                    </p>
                    <p class="text-[8px] text-gray-400">
                      {{ adminStats.students }} siswa
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
              <div class="px-5 py-4 border-b">
                <h2 class="text-[13px] font-semibold">
                  Reschedule Menunggu
                </h2>
              </div>

              <div class="p-5">
                <div
                  v-if="adminStats.pendingReschedule === 0"
                  class="text-sm text-gray-400"
                >
                  Tidak ada pengajuan.
                </div>

                <div
                  v-for="request in rescheduleRequests.filter(r => r.status === 'Menunggu').slice(0, 3)"
                  :key="request.id"
                  class="py-3 border-b last:border-0"
                >
                  <p class="text-[10px] font-semibold">
                    {{ request.student }}
                  </p>
                  <p class="text-[8px] text-gray-500">
                    {{ request.parent }} • {{ request.kelasLama }}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </template>


        <!-- =================================================
             TEACHER DASHBOARD
        ================================================== -->
        <template v-if="role === 'teacher' && activeMenu === 'Dashboard'">

          <div class="grid grid-cols-4 gap-4 mb-5">

            <div class="bg-white rounded-xl p-5 shadow-sm">
              <p class="text-[10px] text-gray-500">Total Kelas</p>
              <p class="text-[25px] font-bold mt-2">
                {{ teacherStats.kelas }}
              </p>
              <p class="text-[9px] text-blue-500 mt-2">
                Semester ini
              </p>
            </div>

            <div class="bg-white rounded-xl p-5 shadow-sm">
              <p class="text-[10px] text-gray-500">Total Murid</p>
              <p class="text-[25px] font-bold mt-2">
                {{ teacherStats.siswa }}
              </p>
              <p class="text-[9px] text-blue-500 mt-2">
                Aktif terdaftar
              </p>
            </div>

            <div class="bg-white rounded-xl p-5 shadow-sm">
              <p class="text-[10px] text-gray-500">Jam Mengajar</p>
              <p class="text-[25px] font-bold mt-2">
                {{ teacherStats.jam }}
              </p>
              <p class="text-[9px] text-blue-500 mt-2">
                Per minggu
              </p>
            </div>

            <div class="bg-white rounded-xl p-5 shadow-sm">
              <p class="text-[10px] text-gray-500">Avg Kehadiran</p>
              <p class="text-[25px] font-bold mt-2">
                {{ teacherStats.kehadiran }}%
              </p>
              <p class="text-[9px] text-green-600 mt-2">
                Bulan ini
              </p>
            </div>

          </div>

          <div class="grid grid-cols-[2fr_1fr] gap-4">

            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
              <div class="px-5 py-4 border-b">
                <h2 class="text-[13px] font-semibold">
                  Rekap Absensi Terkini
                </h2>
              </div>

              <div
                v-for="item in teacherClasses"
                :key="item.nama"
                class="px-5 py-4 border-b last:border-0 flex justify-between"
              >
                <div>
                  <p class="text-[10px] font-semibold">
                    {{ item.nama }}
                  </p>
                  <p class="text-[8px] text-gray-400">
                    {{ item.siswa }} siswa
                  </p>
                </div>

                <div class="flex gap-3 text-[8px]">
                  <span class="text-green-600">
                    {{ item.hadir }} Hadir
                  </span>
                  <span class="text-yellow-500">
                    {{ item.izin }} Izin
                  </span>
                  <span class="text-red-500">
                    {{ item.alfa }} Alfa
                  </span>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
              <div class="px-5 py-4 border-b">
                <h2 class="text-[13px] font-semibold">
                  Tugas & Pengingat
                </h2>
              </div>

              <div class="p-5 space-y-4">
                <label
                  v-for="task in teacherTasks"
                  :key="task.id"
                  class="flex gap-2 text-[10px] cursor-pointer"
                  :class="task.selesai ? 'text-gray-400 line-through' : ''"
                >
                  <input
                    v-model="task.selesai"
                    type="checkbox"
                    class="accent-blue-600"
                  />
                  {{ task.text }}
                </label>
              </div>
            </div>

          </div>

        </template>


        <!-- =================================================
             STUDENT MANAGEMENT
        ================================================== -->
        <template v-if="activeMenu === 'Student Management'">

          <div class="bg-white rounded-xl shadow-sm overflow-hidden">

            <div class="p-5 border-b flex items-center justify-between">
              <div>
                <h2 class="text-[15px] font-bold">
                  Student Management
                </h2>
                <p class="text-[9px] text-gray-500">
                  Kelola data student.
                </p>
              </div>

              <button
                @click="showAddStudent = true"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg text-[10px] hover:bg-blue-700"
              >
                + Tambah Student
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-[10px]">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="text-left p-4">ID</th>
                    <th class="text-left p-4">Nama</th>
                    <th class="text-left p-4">Kelas</th>
                    <th class="text-left p-4">Status</th>
                    <th class="text-left p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="student in students"
                    :key="student.id"
                    class="border-t"
                  >
                    <td class="p-4">{{ student.id }}</td>
                    <td class="p-4 font-semibold">{{ student.nama }}</td>
                    <td class="p-4">{{ student.kelas }}</td>
                    <td class="p-4">
                      <span class="px-2 py-1 rounded-full bg-green-100 text-green-700">
                        {{ student.status }}
                      </span>
                    </td>
                    <td class="p-4">
                      <button
                        @click="deleteStudent(student.id)"
                        class="px-3 py-1 rounded bg-red-500 text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

        </template>


        <!-- =================================================
             USER MANAGEMENT
        ================================================== -->
        <template v-if="activeMenu === 'User Management'">

          <div class="bg-white rounded-xl shadow-sm overflow-hidden">

            <div class="p-5 border-b flex items-center justify-between">
              <div>
                <h2 class="text-[15px] font-bold">
                  User Management
                </h2>
                <p class="text-[9px] text-gray-500">
                  Kelola Admin, Teacher, dan Parent.
                </p>
              </div>

              <button
                @click="showAddUser = true"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg text-[10px]"
              >
                + Tambah User
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-[10px]">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="text-left p-4">Nama</th>
                    <th class="text-left p-4">Email</th>
                    <th class="text-left p-4">Role</th>
                    <th class="text-left p-4">Status</th>
                    <th class="text-left p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="item in users"
                    :key="item.id"
                    class="border-t"
                  >
                    <td class="p-4 font-semibold">{{ item.nama }}</td>
                    <td class="p-4">{{ item.email }}</td>
                    <td class="p-4">{{ item.role }}</td>
                    <td class="p-4">
                      <span class="px-2 py-1 rounded-full bg-green-100 text-green-700">
                        {{ item.status }}
                      </span>
                    </td>
                    <td class="p-4">
                      <button
                        @click="deleteUser(item.id)"
                        class="px-3 py-1 rounded bg-red-500 text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

        </template>


        <!-- =================================================
             LIST ABSENSI
        ================================================== -->
        <template v-if="activeMenu === 'List Absensi'">

          <div class="bg-white rounded-xl shadow-sm overflow-hidden">

            <div class="p-5 border-b">
              <h2 class="text-[15px] font-bold">
                List Absensi
              </h2>
              <p class="text-[9px] text-gray-500">
                Admin dan Teacher dapat mengedit atau menghapus absensi.
              </p>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-[10px]">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="text-left p-4">Siswa</th>
                    <th class="text-left p-4">Kelas</th>
                    <th class="text-left p-4">Tanggal</th>
                    <th class="text-left p-4">Status</th>
                    <th class="text-left p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="item in attendance"
                    :key="item.id"
                    class="border-t"
                  >
                    <td class="p-4 font-semibold">{{ item.siswa }}</td>
                    <td class="p-4">{{ item.kelas }}</td>
                    <td class="p-4">{{ item.tanggal }}</td>
                    <td class="p-4">
                      <span
                        class="px-2 py-1 rounded-full"
                        :class="{
                          'bg-green-100 text-green-700': item.status === 'Hadir',
                          'bg-yellow-100 text-yellow-700': item.status === 'Izin',
                          'bg-red-100 text-red-700': item.status === 'Alfa'
                        }"
                      >
                        {{ item.status }}
                      </span>
                    </td>
                    <td class="p-4 flex gap-2">
                      <button
                        @click="openEditAttendance(item)"
                        class="px-3 py-1 bg-blue-500 text-white rounded"
                      >
                        Edit
                      </button>

                      <button
                        @click="deleteAttendance(item.id)"
                        class="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

        </template>


        <!-- =================================================
             RESCHEDULE ADMIN / TEACHER
        ================================================== -->
        <template v-if="activeMenu === 'Reschedule'">

          <div class="space-y-4">

            <div>
              <h2 class="text-[15px] font-bold">
                Reschedule
              </h2>
              <p class="text-[9px] text-gray-500">
                Menerima laporan orang tua dan menentukan jadwal kelas pengganti.
              </p>
            </div>

            <div
              v-if="rescheduleRequests.length === 0"
              class="bg-white rounded-xl p-8 text-center text-gray-400 text-sm"
            >
              Belum ada pengajuan reschedule.
            </div>

            <div
              v-for="request in rescheduleRequests"
              :key="request.id"
              class="bg-white rounded-xl p-5 shadow-sm"
            >

              <div class="flex justify-between gap-5">

                <div>
                  <h3 class="text-[12px] font-bold">
                    {{ request.student }}
                  </h3>

                  <p class="text-[9px] text-gray-500 mt-1">
                    Orang tua: {{ request.parent }}
                  </p>

                  <p class="text-[10px] mt-4">
                    Kelas sebelumnya:
                    <b>{{ request.kelasLama }}</b>
                  </p>

                  <p class="text-[10px]">
                    Alasan:
                    {{ request.alasan }}
                  </p>

                  <p class="text-[9px] text-gray-400 mt-2">
                    Diajukan: {{ request.tanggalPengajuan }}
                  </p>
                </div>

                <div class="text-right">
                  <span
                    class="px-3 py-1 rounded-full text-[9px]"
                    :class="{
                      'bg-yellow-100 text-yellow-700': request.status === 'Menunggu',
                      'bg-green-100 text-green-700': request.status === 'Disetujui',
                      'bg-red-100 text-red-700': request.status === 'Ditolak'
                    }"
                  >
                    {{ request.status }}
                  </span>
                </div>

              </div>

              <div
                v-if="request.jadwalPengganti"
                class="mt-4 p-3 rounded-lg bg-green-50 text-green-700 text-[10px]"
              >
                Jadwal pengganti:
                <b>{{ request.jadwalPengganti }}</b>
              </div>

              <div
                v-if="request.status === 'Menunggu'"
                class="mt-4 flex gap-2"
              >
                <button
                  @click="openReschedule(request)"
                  class="px-4 py-2 rounded-lg bg-green-600 text-white text-[10px]"
                >
                  Terima & Atur Jadwal
                </button>

                <button
                  @click="rejectReschedule(request)"
                  class="px-4 py-2 rounded-lg bg-red-500 text-white text-[10px]"
                >
                  Tolak
                </button>
              </div>

            </div>

          </div>

        </template>


        <!-- =================================================
             PARENT: KEHADIRAN
        ================================================== -->
        <template v-if="role === 'orang_tua' && activeMenu === 'Kehadiran Anak'">

          <div class="mb-5">
            <label class="text-[10px] text-gray-500">
              Pilih Anak
            </label>

            <select
              v-model="selectedChildId"
              class="mt-1 border rounded-lg px-4 py-2 text-[10px] bg-white"
            >
              <option
                v-for="child in children"
                :key="child.id"
                :value="child.id"
              >
                {{ child.nama }} - {{ child.kelas }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-4 gap-4 mb-5">

            <div class="bg-white rounded-xl p-5 shadow-sm">
              <p class="text-[10px] text-gray-500">Kehadiran</p>
              <p class="text-[25px] font-bold mt-2">
                {{ parentStats.persentase }}%
              </p>
              <p class="text-[9px] text-green-600 mt-2">
                Tingkat kehadiran
              </p>
            </div>

            <div class="bg-white rounded-xl p-5 shadow-sm">
              <p class="text-[10px] text-gray-500">Hadir</p>
              <p class="text-[25px] font-bold mt-2">
                {{ parentStats.hadir }}
              </p>
            </div>

            <div class="bg-white rounded-xl p-5 shadow-sm">
              <p class="text-[10px] text-gray-500">Izin</p>
              <p class="text-[25px] font-bold mt-2">
                {{ parentStats.izin }}
              </p>
            </div>

            <div class="bg-white rounded-xl p-5 shadow-sm">
              <p class="text-[10px] text-gray-500">Alfa</p>
              <p class="text-[25px] font-bold mt-2">
                {{ parentStats.alfa }}
              </p>
            </div>

          </div>

          <div class="bg-white rounded-xl shadow-sm overflow-hidden">

            <div class="p-5 border-b">
              <h2 class="text-[13px] font-bold">
                Data Kehadiran {{ selectedChild?.nama }}
              </h2>
            </div>

            <table class="w-full text-[10px]">
              <thead class="bg-gray-50">
                <tr>
                  <th class="text-left p-4">Tanggal</th>
                  <th class="text-left p-4">Mata Pelajaran</th>
                  <th class="text-left p-4">Status</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="item in parentAttendance"
                  :key="item.tanggal + item.mapel"
                  class="border-t"
                >
                  <td class="p-4">{{ item.tanggal }}</td>
                  <td class="p-4">{{ item.mapel }}</td>
                  <td class="p-4">
                    <span
                      class="px-2 py-1 rounded-full"
                      :class="{
                        'bg-green-100 text-green-700': item.status === 'Hadir',
                        'bg-yellow-100 text-yellow-700': item.status === 'Izin',
                        'bg-red-100 text-red-700': item.status === 'Alfa'
                      }"
                    >
                      {{ item.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

          </div>

        </template>


        <!-- =================================================
             PARENT: PROFILE ANAK
        ================================================== -->
        <template v-if="role === 'orang_tua' && activeMenu === 'Profile Anak'">

          <div class="space-y-5">

            <div>
              <h2 class="text-[15px] font-bold">
                Profile Anak
              </h2>
              <p class="text-[9px] text-gray-500">
                Tambahkan anak menggunakan ID student.
              </p>
            </div>

            <div class="bg-white rounded-xl p-5 shadow-sm">

              <h3 class="text-[12px] font-semibold mb-3">
                Tambah Profile Anak
              </h3>

              <div class="flex gap-2">

                <input
                  v-model="childIdInput"
                  type="text"
                  placeholder="Contoh: STD002"
                  class="flex-1 border rounded-lg px-4 py-2 text-[10px] outline-none focus:ring-2 focus:ring-blue-200"
                  @keyup.enter="addChild"
                />

                <button
                  @click="addChild"
                  class="px-5 py-2 rounded-lg bg-blue-600 text-white text-[10px]"
                >
                  + Tambah Anak
                </button>

              </div>

            </div>

            <div class="grid grid-cols-2 gap-4">

              <div
                v-for="child in children"
                :key="child.id"
                class="bg-white rounded-xl p-5 shadow-sm"
              >

                <div class="flex items-center gap-4">

                  <div
                    class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl"
                  >
                    ♙
                  </div>

                  <div>
                    <h3 class="text-[13px] font-bold">
                      {{ child.nama }}
                    </h3>

                    <p class="text-[9px] text-gray-500">
                      ID: {{ child.id }}
                    </p>

                    <p class="text-[9px] text-blue-600">
                      {{ child.kelas }}
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </template>


        <!-- =================================================
             PARENT: PENGAJUAN
        ================================================== -->
        <template v-if="role === 'orang_tua' && activeMenu === 'Pengajuan Kelas Pengganti'">

          <div class="max-w-2xl">

            <div class="bg-white rounded-xl shadow-sm p-6">

              <h2 class="text-[15px] font-bold">
                Pengajuan Kelas Pengganti
              </h2>

              <p class="text-[9px] text-gray-500 mt-1 mb-5">
                Ajukan kelas pengganti jika anak tidak dapat mengikuti jadwal kelas.
              </p>

              <div class="space-y-4">

                <div>
                  <label class="block text-[10px] font-medium mb-1">
                    Anak
                  </label>

                  <select
                    v-model="parentRescheduleForm.childId"
                    class="w-full border rounded-lg px-4 py-2 text-[10px]"
                  >
                    <option
                      v-for="child in children"
                      :key="child.id"
                      :value="child.id"
                    >
                      {{ child.nama }} - {{ child.kelas }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-[10px] font-medium mb-1">
                    Kelas yang tidak dapat diikuti
                  </label>

                  <input
                    v-model="parentRescheduleForm.kelasLama"
                    type="text"
                    placeholder="Contoh: SMP 3 - Senin 10:00"
                    class="w-full border rounded-lg px-4 py-2 text-[10px]"
                  />
                </div>

                <div>
                  <label class="block text-[10px] font-medium mb-1">
                    Alasan
                  </label>

                  <textarea
                    v-model="parentRescheduleForm.alasan"
                    rows="4"
                    placeholder="Jelaskan alasan pengajuan..."
                    class="w-full border rounded-lg px-4 py-2 text-[10px] resize-none"
                  ></textarea>
                </div>

                <button
                  @click="submitParentReschedule"
                  class="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-semibold"
                >
                  Kirim Pengajuan
                </button>

              </div>

            </div>

          </div>

        </template>


        <!-- =================================================
             PARENT: RIWAYAT
        ================================================== -->
        <template v-if="role === 'orang_tua' && activeMenu === 'Riwayat Kelas Pengganti'">

          <div class="bg-white rounded-xl shadow-sm overflow-hidden">

            <div class="p-5 border-b">
              <h2 class="text-[15px] font-bold">
                Riwayat Kelas Pengganti
              </h2>
              <p class="text-[9px] text-gray-500">
                Riwayat pengajuan kelas pengganti anak.
              </p>
            </div>

            <div
              v-if="replacementHistory.length === 0"
              class="p-8 text-center text-gray-400 text-sm"
            >
              Belum ada riwayat.
            </div>

            <div
              v-for="item in replacementHistory"
              :key="item.id"
              class="p-5 border-b last:border-0"
            >

              <div class="flex justify-between">

                <div>
                  <h3 class="text-[11px] font-bold">
                    {{ item.anak }}
                  </h3>

                  <p class="text-[9px] text-gray-500 mt-1">
                    {{ item.tanggal }}
                  </p>

                  <p class="text-[10px] mt-3">
                    Kelas lama:
                    <b>{{ item.kelasLama }}</b>
                  </p>

                  <p class="text-[10px]">
                    Kelas pengganti:
                    <b>{{ item.jadwalBaru }}</b>
                  </p>
                </div>

                <span
                  class="h-fit px-3 py-1 rounded-full text-[9px]"
                  :class="{
                    'bg-green-100 text-green-700': item.status === 'Disetujui',
                    'bg-yellow-100 text-yellow-700': item.status === 'Menunggu',
                    'bg-red-100 text-red-700': item.status === 'Ditolak'
                  }"
                >
                  {{ item.status }}
                </span>

              </div>

            </div>

          </div>

        </template>

      </section>
    </main>


    <!-- =====================================================
         MODAL TAMBAH STUDENT
    ====================================================== -->
    <div
      v-if="showAddStudent"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl w-[420px] p-6">

        <div class="flex justify-between mb-5">
          <h2 class="font-bold">Tambah Student</h2>
          <button @click="showAddStudent = false">✕</button>
        </div>

        <div class="space-y-3">

          <input
            v-model="studentForm.id"
            placeholder="ID Student"
            class="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <input
            v-model="studentForm.nama"
            placeholder="Nama Student"
            class="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <input
            v-model="studentForm.kelas"
            placeholder="Kelas"
            class="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <select
            v-model="studentForm.status"
            class="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option>Aktif</option>
            <option>Nonaktif</option>
          </select>

          <button
            @click="addStudent"
            class="w-full bg-blue-600 text-white rounded-lg py-2"
          >
            Simpan
          </button>

        </div>

      </div>
    </div>


    <!-- =====================================================
         MODAL TAMBAH USER
    ====================================================== -->
    <div
      v-if="showAddUser"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl w-[420px] p-6">

        <div class="flex justify-between mb-5">
          <h2 class="font-bold">Tambah User</h2>
          <button @click="showAddUser = false">✕</button>
        </div>

        <div class="space-y-3">

          <input
            v-model="userForm.nama"
            placeholder="Nama"
            class="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <input
            v-model="userForm.email"
            type="email"
            placeholder="Email"
            class="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <select
            v-model="userForm.role"
            class="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option>Admin</option>
            <option>Teacher</option>
            <option>Parent</option>
          </select>

          <button
            @click="addUser"
            class="w-full bg-blue-600 text-white rounded-lg py-2"
          >
            Simpan
          </button>

        </div>

      </div>
    </div>


    <!-- =====================================================
         MODAL EDIT ABSENSI
    ====================================================== -->
    <div
      v-if="showEditAttendance"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl w-[420px] p-6">

        <div class="flex justify-between mb-5">
          <h2 class="font-bold">Edit Absensi</h2>
          <button @click="showEditAttendance = false">✕</button>
        </div>

        <div class="space-y-3">

          <input
            v-model="editAttendanceForm.siswa"
            class="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <input
            v-model="editAttendanceForm.kelas"
            class="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <input
            v-model="editAttendanceForm.tanggal"
            class="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <select
            v-model="editAttendanceForm.status"
            class="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option>Hadir</option>
            <option>Izin</option>
            <option>Alfa</option>
          </select>

          <button
            @click="saveAttendance"
            class="w-full bg-blue-600 text-white rounded-lg py-2"
          >
            Simpan Perubahan
          </button>

        </div>

      </div>
    </div>


    <!-- =====================================================
         MODAL RESCHEDULE ADMIN / TEACHER
    ====================================================== -->
    <div
      v-if="showRescheduleForm"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl w-[460px] p-6">

        <div class="flex justify-between mb-5">
          <div>
            <h2 class="font-bold">
              Atur Jadwal Pengganti
            </h2>

            <p class="text-[9px] text-gray-500 mt-1">
              {{ selectedReschedule?.student }}
            </p>
          </div>

          <button @click="showRescheduleForm = false">
            ✕
          </button>
        </div>

        <div class="space-y-3">

          <input
            v-model="replacementForm.tanggal"
            type="date"
            class="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <input
            v-model="replacementForm.jam"
            type="time"
            class="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <input
            v-model="replacementForm.guru"
            placeholder="Nama Guru"
            class="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <input
            v-model="replacementForm.kelas"
            placeholder="Kelas pengganti"
            class="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <button
            @click="approveReschedule"
            class="w-full bg-green-600 text-white rounded-lg py-2"
          >
            Simpan & Setujui
          </button>

        </div>

      </div>
    </div>

  </div>
</template>
