import { ref, computed } from "vue";

import { collection, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";

import { db } from "@/firebase/firebase";

const reschedules = ref([]);

export function useReschedule() {
const subscribeReschedule = () => {
  return onSnapshot(collection(db, "reschedules"), async (snapshot) => {
    const today = new Date();

    const result = [];

    for (const d of snapshot.docs) {
      const data = d.data();

      if (data.tanggal) {
        const requestDate = new Date(data.tanggal);

        if (requestDate < today) {
          await deleteDoc(doc(db, "reschedules", d.id));

          continue;
        }
      }

      result.push({
        id: d.id,
        ...data,
      });
    }

    reschedules.value = result;
  });
};

  const approveReschedule = async (requestId, jadwalPengganti) => {
    await updateDoc(doc(db, "reschedules", requestId), {
      status: "Disetujui",
      jadwalPengganti,
    });
  };

  const rejectReschedule = async (requestId) => {
    await updateDoc(doc(db, "reschedules", requestId), {
      status: "Ditolak",
    });
  };

  const pendingCount = computed(
    () => reschedules.value.filter((item) => item.status === "Menunggu").length,
  );

  return {
    reschedules,
    pendingCount,

    subscribeReschedule,

    approveReschedule,
    rejectReschedule,
  };
}


