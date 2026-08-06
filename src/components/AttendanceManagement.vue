<script setup>
import { ref, computed, watch } from "vue";
// Import CLASS_OPTIONS dari service kelas Anda
import { CLASS_OPTIONS } from "@/services/classService"; // Sesuaikan path jika berbeda

const props = defineProps({
  students: {
    type: Array,
    default: () => [],
  },
  attendance: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["save-batch", "back"]);

/* -------------------------------------------------------------------------- */
/* STATE FILTER & HEADER                                                      */
/* -------------------------------------------------------------------------- */
const selectedKelas = ref(CLASS_OPTIONS[0] || "SHS 2");
const selectedMapel = ref("Matematika");
const selectedTanggal = ref(new Date().toISOString().split("T")[0]);
const searchQuery = ref("");
const isSaving = ref(false);

const availableClasses = ref(CLASS_OPTIONS);

const availableSubjects = ref([
  "Matematika",
  "Bahasa Indonesia",
  "Bahasa Inggris",
  "IPA",
  "IPS",
]);

/* -------------------------------------------------------------------------- */
/* SINKRONISASI SISWA DENGAN MATCHING FLEXIBLE                                */
/* -------------------------------------------------------------------------- */
const studentAttendanceList = ref([]);

// Helper untuk normalisasi teks kelas (Menghilangkan spasi berlebih & lowercase)
const normalizeString = (str) => {
  if (!str) return "";
  return String(str).toLowerCase().replace(/\s+/g, " ").trim();
};

const syncStudentList = () => {
  if (!props.students) return;

  const targetClass = normalizeString(selectedKelas.value);

  // Filter siswa: Berstatus "Aktif" & pencocokan nama kelas yang lebih aman
  const activeClassStudents = props.students.filter((s) => {
    // 1. Cek status aktif (Siswa dianggap aktif jika status = 'Aktif' atau status tidak diisi)
    const isAktif = !s.status || normalizeString(s.status) === "aktif";

    // 2. Ambil nilai kelas dari berbagai kemungkinan nama property
    const rawStudentClass = s.kelas || s.class || s.className || s.classId || "";
    const studentClassNormalized = normalizeString(rawStudentClass);

    // 3. Cocokkan kelas
    const isClassMatch = studentClassNormalized === targetClass;

    return isAktif && isClassMatch;
  });

  studentAttendanceList.value = activeClassStudents.map((siswa) => {
    // Cari apakah sudah ada entri absensi untuk siswa pada tanggal & mapel ini
    const existingRec = props.attendance?.find((a) => {
      const matchId =
        (a.studentId && String(a.studentId) === String(siswa.studentId)) ||
        (a.studentDbId && String(a.studentDbId) === String(siswa.id)) ||
        (a.namaSiswa && normalizeString(a.namaSiswa) === normalizeString(siswa.nama));

      const matchDate = a.tanggal === selectedTanggal.value;
      const matchSubject = !a.mapel || normalizeString(a.mapel) === normalizeString(selectedMapel.value);

      return matchId && matchDate && matchSubject;
    });

    return {
      dbId: siswa.id,
      studentId: siswa.studentId || siswa.id,
      nama: siswa.nama || "Siswa Tanpa Nama",
      kelas: siswa.kelas || selectedKelas.value,
      status: existingRec ? existingRec.status : "Hadir",
      existingAttendanceId: existingRec ? existingRec.id : null,
    };
  });
};

watch(
  [() => props.students, () => props.attendance, selectedKelas, selectedTanggal, selectedMapel],
  () => {
    syncStudentList();
  },
  { immediate: true, deep: true }
);

/* Filter Pencarian nama / studentId */
const filteredStudentList = computed(() => {
  if (!searchQuery.value.trim()) return studentAttendanceList.value;
  const q = searchQuery.value.toLowerCase();
  return studentAttendanceList.value.filter(
    (s) =>
      s.nama.toLowerCase().includes(q) ||
      (s.studentId && s.studentId.toString().toLowerCase().includes(q))
  );
});

/* -------------------------------------------------------------------------- */
/* STATISTIK & REKAP KEHADIRAN                                               */
/* -------------------------------------------------------------------------- */
const countHadir = computed(() => studentAttendanceList.value.filter((s) => s.status === "Hadir").length);
const countIzin = computed(() => studentAttendanceList.value.filter((s) => s.status === "Izin").length);
const countSakit = computed(() => studentAttendanceList.value.filter((s) => s.status === "Sakit").length);
const countAlfa = computed(() => studentAttendanceList.value.filter((s) => s.status === "Alfa").length);

const totalSiswaInClass = computed(() => studentAttendanceList.value.length);

const attendancePercentage = computed(() => {
  if (totalSiswaInClass.value === 0) return 0;
  return Math.round((countHadir.value / totalSiswaInClass.value) * 100);
});

const formattedDateHeader = computed(() => {
  if (!selectedTanggal.value) return "";
  const d = new Date(selectedTanggal.value);
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
});

/* -------------------------------------------------------------------------- */
/* HANDLERS                                                                   */
/* -------------------------------------------------------------------------- */
const setStatus = (studentDbId, status) => {
  const target = studentAttendanceList.value.find((s) => s.dbId === studentDbId);
  if (target) {
    target.status = status;
  }
};

const markAll = (status) => {
  studentAttendanceList.value.forEach((s) => {
    s.status = status;
  });
};

const saveAttendanceBatch = async () => {
  if (studentAttendanceList.value.length === 0) {
    alert(`Tidak ada siswa aktif di kelas ${selectedKelas.value} untuk disimpan.`);
    return;
  }

  isSaving.value = true;
  try {
    const payload = studentAttendanceList.value.map((s) => ({
      id: s.existingAttendanceId || null,
      studentDbId: s.dbId,
      studentId: s.studentId,
      namaSiswa: s.nama,
      kelas: selectedKelas.value,
      mapel: selectedMapel.value,
      tanggal: selectedTanggal.value,
      status: s.status,
    }));

    emit("save-batch", payload);
    alert("Data absensi berhasil disimpan!");
  } catch (error) {
    console.error("Gagal menyimpan absensi:", error);
    alert("Terjadi kesalahan saat menyimpan absensi.");
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div class="space-y-6 font-sans text-slate-800 pb-12">
    <!-- TOP HEADER -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <button
          @click="$emit('back')"
          class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm cursor-pointer"
        >
          ← Kembali
        </button>
        <div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Absensi Siswa</h2>
          <p class="text-xs text-slate-500 capitalize mt-0.5">{{ formattedDateHeader }}</p>
        </div>
      </div>

      <button
        @click="saveAttendanceBatch"
        :disabled="isSaving"
        class="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
      >
        <span v-if="isSaving">Menyimpan...</span>
        <template v-else>
          <span>📋</span>
          <span>Simpan Absensi</span>
        </template>
      </button>
    </div>

    <!-- FILTER BAR -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/60 p-1 rounded-2xl">
      <div>
        <label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          Kelas
        </label>
        <select
          v-model="selectedKelas"
          class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option v-for="kelas in availableClasses" :key="kelas" :value="kelas">
            {{ kelas }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          Mata Pelajaran
        </label>
        <select
          v-model="selectedMapel"
          class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option v-for="m in availableSubjects" :key="m" :value="m">{{ m }}</option>
        </select>
      </div>

      <div>
        <label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          Tanggal
        </label>
        <input
          type="date"
          v-model="selectedTanggal"
          class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
    </div>

    <!-- SUMMARY CARDS -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div class="bg-emerald-50/80 border border-emerald-200/60 rounded-2xl p-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center font-bold text-lg">
          ✓
        </div>
        <div>
          <p class="text-2xl font-black text-emerald-800">{{ countHadir }}</p>
          <p class="text-[11px] font-semibold text-emerald-600">Hadir</p>
        </div>
      </div>

      <div class="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 text-amber-600 flex items-center justify-center font-bold text-lg">
          🕒
        </div>
        <div>
          <p class="text-2xl font-black text-amber-800">{{ countIzin }}</p>
          <p class="text-[11px] font-semibold text-amber-600">Izin</p>
        </div>
      </div>

      <div class="bg-blue-50/80 border border-blue-200/60 rounded-2xl p-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-100 border border-blue-300 text-blue-600 flex items-center justify-center font-bold text-lg">
          !
        </div>
        <div>
          <p class="text-2xl font-black text-blue-800">{{ countSakit }}</p>
          <p class="text-[11px] font-semibold text-blue-600">Sakit</p>
        </div>
      </div>

      <div class="bg-rose-50/80 border border-rose-200/60 rounded-2xl p-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-rose-100 border border-rose-300 text-rose-600 flex items-center justify-center font-bold text-lg">
          ⊗
        </div>
        <div>
          <p class="text-2xl font-black text-rose-800">{{ countAlfa }}</p>
          <p class="text-[11px] font-semibold text-rose-600">Alfa</p>
        </div>
      </div>
    </div>

    <!-- TINGKAT KEHADIRAN -->
    <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
      <div class="flex items-center justify-between text-xs font-bold text-slate-700">
        <span>Tingkat Kehadiran - {{ selectedKelas }}</span>
        <span class="text-rose-600 font-extrabold text-sm">{{ attendancePercentage }}%</span>
      </div>

      <div class="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5">
        <div
          class="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500"
          :style="{ width: `${attendancePercentage}%` }"
        ></div>
      </div>

      <p class="text-[11px] font-medium text-slate-400">
        {{ countHadir }} dari {{ totalSiswaInClass }} siswa aktif hadir
      </p>
    </div>

    <!-- TABLE DAFTAR SISWA -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div class="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
        <h3 class="text-base font-bold text-slate-900">
          Daftar Siswa Kelas {{ selectedKelas }}
        </h3>

        <div class="flex items-center gap-3 flex-wrap">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Cari nama / ID"
            class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-44"
          />

          <div class="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span>Tandai semua :</span>
            <button
              @click="markAll('Hadir')"
              class="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200 transition cursor-pointer"
            >
              ✓ Hadir
            </button>
            <button
              @click="markAll('Alfa')"
              class="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold border border-rose-200 transition cursor-pointer"
            >
              ⊗ Alfa
            </button>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-700">
          <thead class="bg-slate-50/70 text-[11px] font-semibold uppercase text-slate-400 border-b border-slate-100">
            <tr>
              <th class="py-3.5 px-6 w-16">No</th>
              <th class="py-3.5 px-6">Nama Siswa</th>
              <th class="py-3.5 px-6">ID Siswa</th>
              <th class="py-3.5 px-6 text-center">Status Kehadiran</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr
              v-for="(siswa, idx) in filteredStudentList"
              :key="siswa.dbId"
              class="hover:bg-slate-50/50 transition-colors"
            >
              <td class="py-4 px-6 text-slate-400 font-semibold">{{ idx + 1 }}</td>
              <td class="py-4 px-6 font-bold text-slate-900">{{ siswa.nama }}</td>
              <td class="py-4 px-6 text-slate-400 text-xs tracking-wider">{{ siswa.studentId || '-' }}</td>
              <td class="py-4 px-6">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="setStatus(siswa.dbId, 'Hadir')"
                    class="px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                    :class="
                      siswa.status === 'Hadir'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                    "
                  >
                    Hadir
                  </button>

                  <button
                    @click="setStatus(siswa.dbId, 'Izin')"
                    class="px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                    :class="
                      siswa.status === 'Izin'
                        ? 'bg-amber-400 text-white shadow-sm'
                        : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                    "
                  >
                    Izin
                  </button>

                  <button
                    @click="setStatus(siswa.dbId, 'Sakit')"
                    class="px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                    :class="
                      siswa.status === 'Sakit'
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    "
                  >
                    Sakit
                  </button>

                  <button
                    @click="setStatus(siswa.dbId, 'Alfa')"
                    class="px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                    :class="
                      siswa.status === 'Alfa'
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                    "
                  >
                    Alfa
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredStudentList.length === 0">
              <td colspan="4" class="py-12 text-center text-slate-400 text-sm">
                Tidak ada data siswa berstatus "Aktif" ditemukan untuk kelas <strong>{{ selectedKelas }}</strong>.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>