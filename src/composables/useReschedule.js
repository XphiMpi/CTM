import { ref, computed } from "vue";

import { collection, updateDoc, doc, onSnapshot } from "firebase/firestore";

import { db } from "@/firebase/firebase";

const reschedules = ref([]);

export function useReschedule() {
  const subscribeReschedule = () => {
    return onSnapshot(collection(db, "reschedules"), (snapshot) => {
      reschedules.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
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
