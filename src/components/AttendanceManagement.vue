<script setup>
import { CLASS_OPTIONS } from "@/services/classService";
import { ref, computed, watch, onMounted } from "vue";
import * as faceapi from "face-api.js";

/* -------------------------------------------------------------------------- */
/* PROPS                                                                      */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* EMITS                                                                      */
/* -------------------------------------------------------------------------- */

const emit = defineEmits(["save-batch", "back"]);

/* -------------------------------------------------------------------------- */
/* STATE FILTER & HEADER                                                      */
/* -------------------------------------------------------------------------- */

const selectedKelas = ref(CLASS_OPTIONS[0] || "SHS 2");

const selectedMapel = ref("Matematika");

const selectedTanggal = ref(
  new Date().toISOString().split("T")[0]
);

const selectedJam = ref("");

const selectedMateri = ref("");

const searchQuery = ref("");

const isSaving = ref(false);

const modelLoaded = ref(false);

/* -------------------------------------------------------------------------- */
/* FOTO & FACE DETECTION                                                      */
/* -------------------------------------------------------------------------- */

const attendancePhoto = ref(null);

const attendancePhotoPreview = ref("");

const detectedFaces = ref(0);

const availableClasses = ref(CLASS_OPTIONS);

/* -------------------------------------------------------------------------- */
/* MATA PELAJARAN                                                             */
/* -------------------------------------------------------------------------- */

const availableSubjects = ref([
  "Mathematics",
  "English",
  "Physics"
]);

/* -------------------------------------------------------------------------- */
/* LOAD FACE API                                                              */
/* -------------------------------------------------------------------------- */

onMounted(async () => {
  try {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");

    modelLoaded.value = true;

    console.log("✅ FaceAPI Loaded");
  } catch (error) {
    console.error("FaceAPI Load Error:", error);
  }
});

/* -------------------------------------------------------------------------- */
/* SINKRONISASI SISWA                                                         */
/* -------------------------------------------------------------------------- */

const studentAttendanceList = ref([]);

/* -------------------------------------------------------------------------- */
/* NORMALIZE STRING                                                           */
/* -------------------------------------------------------------------------- */

const normalizeString = (str) => {
  if (!str) return "";

  return String(str)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
};

/* -------------------------------------------------------------------------- */
/* SYNC STUDENT LIST                                                          */
/* -------------------------------------------------------------------------- */

const syncStudentList = () => {
  if (!props.students) return;

  const targetClass = normalizeString(selectedKelas.value);

  /*
   * Filter siswa:
   * - Status Aktif
   * - Kelas sesuai kelas yang dipilih
   */

  const activeClassStudents = props.students.filter((s) => {
    /* Cek status aktif */

    const isAktif =
      !s.status ||
      normalizeString(s.status) === "aktif";

    /*
     * Ambil kelas dari beberapa kemungkinan property
     */

    const rawStudentClass =
      s.kelas ||
      s.class ||
      s.className ||
      s.classId ||
      "";

    const studentClassNormalized =
      normalizeString(rawStudentClass);

    /*
     * Cocokkan kelas
     */

    const isClassMatch =
      studentClassNormalized === targetClass;

    return isAktif && isClassMatch;
  });

  /*
   * Buat daftar absensi siswa
   */

  studentAttendanceList.value =
    activeClassStudents.map((siswa) => {
      /*
       * Cari apakah siswa sudah memiliki
       * data absensi sebelumnya.
       */

      const existingRec = props.attendance?.find((a) => {
        const matchId =
          (a.studentId &&
            String(a.studentId) ===
              String(siswa.studentId)) ||

          (a.studentDbId &&
            String(a.studentDbId) ===
              String(siswa.id)) ||

          (a.namaSiswa &&
            normalizeString(a.namaSiswa) ===
              normalizeString(siswa.nama));

        const matchDate =
          a.tanggal === selectedTanggal.value;

        const matchSubject =
          !a.mapel ||
          normalizeString(a.mapel) ===
            normalizeString(selectedMapel.value);

        return (
          matchId &&
          matchDate &&
          matchSubject
        );
      });

      return {
        dbId: siswa.id,

        studentId:
          siswa.studentId ||
          siswa.id,

        nama:
          siswa.nama ||
          "Siswa Tanpa Nama",

        kelas:
          siswa.kelas ||
          selectedKelas.value,

        status:
          existingRec
            ? existingRec.status
            : "Hadir",

        existingAttendanceId:
          existingRec
            ? existingRec.id
            : null,
      };
    });
};

/* -------------------------------------------------------------------------- */
/* WATCH                                                                     */
/* -------------------------------------------------------------------------- */

watch(
  [
    () => props.students,
    () => props.attendance,
    selectedKelas,
    selectedTanggal,
    selectedMapel,
  ],
  () => {
    syncStudentList();
  },
  {
    immediate: true,
    deep: true,
  }
);

/* -------------------------------------------------------------------------- */
/* FILTER PENCARIAN                                                           */
/* -------------------------------------------------------------------------- */

const filteredStudentList = computed(() => {
  if (!searchQuery.value.trim()) {
    return studentAttendanceList.value;
  }

  const q =
    searchQuery.value.toLowerCase();

  return studentAttendanceList.value.filter(
    (s) =>
      s.nama
        .toLowerCase()
        .includes(q) ||
      (
        s.studentId &&
        s.studentId
          .toString()
          .toLowerCase()
          .includes(q)
      )
  );
});

/* -------------------------------------------------------------------------- */
/* STATISTIK ABSENSI                                                          */
/* -------------------------------------------------------------------------- */

const countHadir = computed(
  () =>
    studentAttendanceList.value.filter(
      (s) => s.status === "Hadir"
    ).length
);

const countIzin = computed(
  () =>
    studentAttendanceList.value.filter(
      (s) => s.status === "Izin"
    ).length
);

const countSakit = computed(
  () =>
    studentAttendanceList.value.filter(
      (s) => s.status === "Sakit"
    ).length
);

const countAlfa = computed(
  () =>
    studentAttendanceList.value.filter(
      (s) => s.status === "Alfa"
    ).length
);

const totalSiswaInClass = computed(
  () =>
    studentAttendanceList.value.length
);

const attendancePercentage = computed(() => {
  if (totalSiswaInClass.value === 0) {
    return 0;
  }

  return Math.round(
    (countHadir.value /
      totalSiswaInClass.value) *
      100
  );
});

/* -------------------------------------------------------------------------- */
/* FORMAT TANGGAL                                                             */
/* -------------------------------------------------------------------------- */

const formattedDateHeader = computed(() => {
  if (!selectedTanggal.value) {
    return "";
  }

  const d =
    new Date(selectedTanggal.value);

  return d.toLocaleDateString(
    "id-ID",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
});

/* -------------------------------------------------------------------------- */
/* HANDLER STATUS                                                             */
/* -------------------------------------------------------------------------- */

const setStatus = (
  studentDbId,
  status
) => {
  const target =
    studentAttendanceList.value.find(
      (s) => s.dbId === studentDbId
    );

  if (target) {
    target.status = status;
  }
};

/* -------------------------------------------------------------------------- */
/* TANDAI SEMUA                                                               */
/* -------------------------------------------------------------------------- */

const markAll = (status) => {
  studentAttendanceList.value.forEach(
    (s) => {
      s.status = status;
    }
  );
};

/* -------------------------------------------------------------------------- */
/* UPLOAD FOTO                                                                */
/* -------------------------------------------------------------------------- */

const handlePhotoUpload = async (
  event
) => {
  try {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    attendancePhoto.value =
      file;

    const imageUrl =
      URL.createObjectURL(file);

    attendancePhotoPreview.value =
      imageUrl;

    const img = new Image();

    img.src = imageUrl;

    await new Promise(
      (resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      }
    );

    /*
     * Pastikan model Face API
     * sudah selesai dimuat.
     */

    if (!modelLoaded.value) {
      alert(
        "Model Face API belum siap"
      );

      return;
    }

    /*
     * Deteksi wajah
     */

    const detections =
      await faceapi.detectAllFaces(
        img,
        new faceapi.TinyFaceDetectorOptions(
          {
            inputSize: 416,
            scoreThreshold: 0.3,
          }
        )
      );

    console.log(
      "Faces Detected:",
      detections.length
    );

    detectedFaces.value =
      detections.length;
  } catch (error) {
    console.error(
      "Face Detection Error:",
      error
    );

    detectedFaces.value = 0;
  }
};

/* -------------------------------------------------------------------------- */
/* SAVE ATTENDANCE BATCH                                                      */
/* -------------------------------------------------------------------------- */

const saveAttendanceBatch =
  async () => {
    /*
     * Validasi foto
     */

    if (!attendancePhoto.value) {
      alert(
        "Upload foto kelas terlebih dahulu"
      );

      return;
    }

    /*
     * Validasi jam
     */

    if (!selectedJam.value) {
      alert(
        "Silakan masukkan jam absensi terlebih dahulu"
      );

      return;
    }

    /*
     * Validasi materi
     */

    if (!selectedMateri.value.trim()) {
      alert(
        "Silakan masukkan materi pembelajaran terlebih dahulu"
      );

      return;
    }

    /*
     * Validasi jumlah wajah
     */

    if (
      detectedFaces.value !==
      countHadir.value
    ) {
      alert(
        `Jumlah wajah (${detectedFaces.value}) tidak sama dengan jumlah siswa hadir (${countHadir.value})`
      );

      return;
    }

    /*
     * Validasi siswa
     */

    if (
      studentAttendanceList.value
        .length === 0
    ) {
      alert(
        `Tidak ada siswa aktif di kelas ${selectedKelas.value} untuk disimpan.`
      );

      return;
    }

    isSaving.value = true;

    try {
      /*
       * PAYLOAD ABSENSI
       *
       * Sekarang ditambahkan:
       * - jam
       * - materi
       */

      const payload =
        studentAttendanceList.value.map(
          (s) => ({
            id:
              s.existingAttendanceId ||
              null,

            studentDbId:
              s.dbId,

            studentId:
              s.studentId,

            namaSiswa:
              s.nama,

            kelas:
              selectedKelas.value,

            mapel:
              selectedMapel.value,

            tanggal:
              selectedTanggal.value,

            jam:
              selectedJam.value,

            materi:
              selectedMateri.value.trim(),

            status:
              s.status,
          })
        );

      /*
       * Kirim data ke parent
       *
       * Parent nanti akan meneruskan
       * ke saveAttendance / Firebase.
       */

      emit("save-batch", {
        attendance: payload,

        photo:
          attendancePhoto.value,

        detectedFaces:
          detectedFaces.value,

        kelas:
          selectedKelas.value,

        mapel:
          selectedMapel.value,

        tanggal:
          selectedTanggal.value,

        jam:
          selectedJam.value,

        materi:
          selectedMateri.value.trim(),
      });
      
    } catch (error) {
      console.error(
        "Gagal menyimpan absensi:",
        error
      );

      alert(
        "Terjadi kesalahan saat menyimpan absensi."
      );
    } finally {
      isSaving.value = false;
    }
  };
</script>

<template>
  <div
    class="space-y-6 font-sans text-slate-800 pb-12"
  >
    <!-- ================================================================ -->
    <!-- TOP HEADER                                                       -->
    <!-- ================================================================ -->

    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div
        class="flex items-center gap-4"
      >
        <button
          @click="$emit('back')"
          class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm cursor-pointer"
        >
          ← Kembali
        </button>

        <div>
          <h2
            class="text-2xl font-bold text-slate-900 tracking-tight"
          >
            Absensi Siswa
          </h2>

          <p
            class="text-xs text-slate-500 capitalize mt-0.5"
          >
            {{ formattedDateHeader }}
          </p>
        </div>
      </div>

      <button
        @click="saveAttendanceBatch"
        :disabled="isSaving"
        class="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
      >
        <span v-if="isSaving">
          Menyimpan...
        </span>

        <template v-else>
          <span>📋</span>
          <span>
            Simpan Absensi
          </span>
        </template>
      </button>
    </div>

    <!-- ================================================================ -->
    <!-- FILTER BAR                                                       -->
    <!-- ================================================================ -->

    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 bg-white/60 p-1 rounded-2xl"
    >
      <!-- KELAS -->

      <div>
        <label
          class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1"
        >
          Kelas
        </label>

        <select
          v-model="selectedKelas"
          class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option
            v-for="kelas in availableClasses"
            :key="kelas"
            :value="kelas"
          >
            {{ kelas }}
          </option>
        </select>
      </div>

      <!-- MATA PELAJARAN -->

      <div>
        <label
          class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1"
        >
          Mata Pelajaran
        </label>

        <select
          v-model="selectedMapel"
          class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option
            v-for="m in availableSubjects"
            :key="m"
            :value="m"
          >
            {{ m }}
          </option>
        </select>
      </div>

      <!-- TANGGAL -->

      <div>
        <label
          class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1"
        >
          Tanggal
        </label>

        <input
          type="date"
          v-model="selectedTanggal"
          class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <!-- JAM -->

      <div>
        <label
          class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1"
        >
          Jam
        </label>

        <input
          type="time"
          v-model="selectedJam"
          class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <!-- MATERI -->

      <div>
        <label
          class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1"
        >
          Materi
        </label>

        <input
          type="text"
          v-model="selectedMateri"
          placeholder="Masukkan materi..."
          class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
    </div>

    <!-- ================================================================ -->
    <!-- FOTO KEHADIRAN                                                   -->
    <!-- ================================================================ -->

    <div
      class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
    >
      <h3
        class="font-bold mb-4"
      >
        Foto Kehadiran Kelas
      </h3>

      <input
        type="file"
        accept="image/*"
        @change="handlePhotoUpload"
        class="w-full border rounded-xl p-2"
      />

      <img
        v-if="attendancePhotoPreview"
        :src="attendancePhotoPreview"
        class="mt-4 max-h-80 rounded-xl border"
      />

      <div
        class="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3"
      >
        Wajah Terdeteksi:

        <strong>
          {{ detectedFaces }}
        </strong>
      </div>
    </div>

    <!-- ================================================================ -->
    <!-- FACE VALIDATION                                                   -->
    <!-- ================================================================ -->

    <div
      v-if="
        attendancePhoto &&
        detectedFaces !== countHadir
      "
      class="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700"
    >
      Jumlah wajah terdeteksi
      ({{ detectedFaces }})
      tidak sama dengan jumlah siswa hadir
      ({{ countHadir }})
    </div>

    <!-- ================================================================ -->
    <!-- SUMMARY CARDS                                                    -->
    <!-- ================================================================ -->

    <div
      class="grid grid-cols-2 sm:grid-cols-5 gap-4"
    >
      <!-- HADIR -->

      <div
        class="bg-emerald-50/80 border border-emerald-200/60 rounded-2xl p-4 flex items-center gap-3"
      >
        <div
          class="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center font-bold text-lg"
        >
          ✓
        </div>

        <div>
          <p
            class="text-2xl font-black text-emerald-800"
          >
            {{ countHadir }}
          </p>

          <p
            class="text-[11px] font-semibold text-emerald-600"
          >
            Hadir
          </p>
        </div>
      </div>

      <!-- IZIN -->

      <div
        class="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-4 flex items-center gap-3"
      >
        <div
          class="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 text-amber-600 flex items-center justify-center font-bold text-lg"
        >
          🕒
        </div>

        <div>
          <p
            class="text-2xl font-black text-amber-800"
          >
            {{ countIzin }}
          </p>

          <p
            class="text-[11px] font-semibold text-amber-600"
          >
            Izin
          </p>
        </div>
      </div>

      <!-- SAKIT -->

      <div
        class="bg-blue-50/80 border border-blue-200/60 rounded-2xl p-4 flex items-center gap-3"
      >
        <div
          class="w-10 h-10 rounded-xl bg-blue-100 border border-blue-300 text-blue-600 flex items-center justify-center font-bold text-lg"
        >
          !
        </div>

        <div>
          <p
            class="text-2xl font-black text-blue-800"
          >
            {{ countSakit }}
          </p>

          <p
            class="text-[11px] font-semibold text-blue-600"
          >
            Sakit
          </p>
        </div>
      </div>

      <!-- ALFA -->

      <div
        class="bg-rose-50/80 border border-rose-200/60 rounded-2xl p-4 flex items-center gap-3"
      >
        <div
          class="w-10 h-10 rounded-xl bg-rose-100 border border-rose-300 text-rose-600 flex items-center justify-center font-bold text-lg"
        >
          ⊗
        </div>

        <div>
          <p
            class="text-2xl font-black text-rose-800"
          >
            {{ countAlfa }}
          </p>

          <p
            class="text-[11px] font-semibold text-rose-600"
          >
            Alfa
          </p>
        </div>
      </div>

      <!-- FACE COUNT -->

      <div
        class="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-center gap-3"
      >
        <div
          class="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center"
        >
          👤
        </div>

        <div>
          <p
            class="text-2xl font-black text-purple-800"
          >
            {{ detectedFaces }}
          </p>

          <p
            class="text-[11px] font-semibold text-purple-600"
          >
            Face Count
          </p>
        </div>
      </div>
    </div>

    <!-- ================================================================ -->
    <!-- TINGKAT KEHADIRAN                                                -->
    <!-- ================================================================ -->

    <div
      class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3"
    >
      <div
        class="flex items-center justify-between text-xs font-bold text-slate-700"
      >
        <span>
          Tingkat Kehadiran -
          {{ selectedKelas }}
        </span>

        <span
          class="text-rose-600 font-extrabold text-sm"
        >
          {{ attendancePercentage }}%
        </span>
      </div>

      <div
        class="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5"
      >
        <div
          class="bg-linear-to-r from-rose-500 via-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500"
          :style="{
            width: `${attendancePercentage}%`,
          }"
        ></div>
      </div>

      <p
        class="text-[11px] font-medium text-slate-400"
      >
        {{ countHadir }}
        dari
        {{ totalSiswaInClass }}
        siswa aktif hadir
      </p>
    </div>

    <!-- ================================================================ -->
    <!-- INFORMASI ABSENSI                                                -->
    <!-- ================================================================ -->

    <div
      class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
    >
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <p
            class="text-[10px] uppercase tracking-wider font-bold text-slate-400"
          >
            Informasi Pertemuan
          </p>

          <h3
            class="text-lg font-bold text-slate-900 mt-1"
          >
            {{ selectedMapel }}
          </h3>
        </div>

        <div
          class="flex flex-wrap gap-3"
        >
          <div
            class="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2"
          >
            <p
              class="text-[10px] text-blue-500 font-semibold"
            >
              Jam
            </p>

            <p
              class="text-sm font-bold text-blue-800"
            >
              {{ selectedJam || "-" }}
            </p>
          </div>

          <div
            class="bg-purple-50 border border-purple-100 rounded-xl px-4 py-2"
          >
            <p
              class="text-[10px] text-purple-500 font-semibold"
            >
              Materi
            </p>

            <p
              class="text-sm font-bold text-purple-800"
            >
              {{ selectedMateri || "-" }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ================================================================ -->
    <!-- TABLE DAFTAR SISWA                                               -->
    <!-- ================================================================ -->

    <div
      class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden"
    >
      <!-- TABLE HEADER -->

      <div
        class="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100"
      >
        <h3
          class="text-base font-bold text-slate-900"
        >
          Daftar Siswa Kelas
          {{ selectedKelas }}
        </h3>

        <div
          class="flex items-center gap-3 flex-wrap"
        >
          <!-- SEARCH -->

          <input
            type="text"
            v-model="searchQuery"
            placeholder="Cari nama / ID"
            class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-44"
          />

          <!-- MARK ALL -->

          <div
            class="flex items-center gap-1.5 text-xs font-medium text-slate-500"
          >
            <span>
              Tandai semua :
            </span>

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

      <!-- TABLE -->

      <div
        class="overflow-x-auto"
      >
        <table
          class="w-full text-left text-sm text-slate-700"
        >
          <!-- HEADER -->

          <thead
            class="bg-slate-50/70 text-[11px] font-semibold uppercase text-slate-400 border-b border-slate-100"
          >
            <tr>
              <th
                class="py-3.5 px-6 w-16"
              >
                No
              </th>

              <th
                class="py-3.5 px-6"
              >
                Nama Siswa
              </th>

              <th
                class="py-3.5 px-6"
              >
                ID Siswa
              </th>

              <th
                class="py-3.5 px-6 text-center"
              >
                Status Kehadiran
              </th>
            </tr>
          </thead>

          <!-- BODY -->

          <tbody
            class="divide-y divide-slate-100 font-medium"
          >
            <tr
              v-for="(
                siswa,
                idx
              ) in filteredStudentList"
              :key="siswa.dbId"
              class="hover:bg-slate-50/50 transition-colors"
            >
              <!-- NO -->

              <td
                class="py-4 px-6 text-slate-400 font-semibold"
              >
                {{ idx + 1 }}
              </td>

              <!-- NAMA -->

              <td
                class="py-4 px-6 font-bold text-slate-900"
              >
                {{ siswa.nama }}
              </td>

              <!-- ID -->

              <td
                class="py-4 px-6 text-slate-400 text-xs tracking-wider"
              >
                {{ siswa.studentId || "-" }}
              </td>

              <!-- STATUS -->

              <td
                class="py-4 px-6"
              >
                <div
                  class="flex items-center justify-center gap-2 flex-wrap"
                >
                  <!-- HADIR -->

                  <button
                    @click="
                      setStatus(
                        siswa.dbId,
                        'Hadir'
                      )
                    "
                    class="px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                    :class="
                      siswa.status ===
                      'Hadir'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                    "
                  >
                    Hadir
                  </button>

                  <!-- IZIN -->

                  <button
                    @click="
                      setStatus(
                        siswa.dbId,
                        'Izin'
                      )
                    "
                    class="px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                    :class="
                      siswa.status ===
                      'Izin'
                        ? 'bg-amber-400 text-white shadow-sm'
                        : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                    "
                  >
                    Izin
                  </button>

                  <!-- SAKIT -->

                  <button
                    @click="
                      setStatus(
                        siswa.dbId,
                        'Sakit'
                      )
                    "
                    class="px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                    :class="
                      siswa.status ===
                      'Sakit'
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    "
                  >
                    Sakit
                  </button>

                  <!-- ALFA -->

                  <button
                    @click="
                      setStatus(
                        siswa.dbId,
                        'Alfa'
                      )
                    "
                    class="px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                    :class="
                      siswa.status ===
                      'Alfa'
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                    "
                  >
                    Alfa
                  </button>
                </div>
              </td>
            </tr>

            <!-- EMPTY -->

            <tr
              v-if="
                filteredStudentList.length ===
                0
              "
            >
              <td
                colspan="4"
                class="py-12 text-center text-slate-400 text-sm"
              >
                Tidak ada data siswa
                berstatus
                "Aktif" ditemukan
                untuk kelas

                <strong>
                  {{ selectedKelas }}
                </strong>.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      class="flex justify-end pt-2"
    >
      <button
        @click="saveAttendanceBatch"
        :disabled="isSaving"
        class="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold text-sm px-8 py-3 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
      >
        <span v-if="isSaving">
          Menyimpan...
        </span>

        <template v-else>
          <span>📋</span>

          <span>
            Simpan Absensi
          </span>
        </template>
      </button>
    </div>
  </div>
</template>