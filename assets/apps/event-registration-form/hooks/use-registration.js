import { useCallback, useMemo, useState } from "react";

export function useRegistration(
  tabs = ["info", "participants", "payment", "confirmation"]
) {
  const [loading, setLoading] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [prices, setPrices] = useState([]);

  const activeTab = useMemo(() => tabs[activeTabIndex], [activeTabIndex, tabs]);

  const load = useCallback(() => {
    jQuery.ajax({
      url: "/wp-admin/admin-ajax.php",
      method: "POST",
      data: {
        action: "get_event",
      },
    });
    return new Promise((resolve) => {
      setLoading(true);
      setPrices([
        { id: 1, label: "Tarif adhérent", amount: 30 },
        { id: 2, label: "Tarif non adhérent", amount: 60 },
      ]);
      setLoading(false);
      resolve();
    });
  }, []);

  return {
    activeTab,
    participants,
    setParticipants,
    prices,
    load,
    nextStep: () => {
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex < tabs.length - 1) {
        setActiveTabIndex(currentIndex + 1);
      }
    },
    prevStep: () => {
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex > 0) {
        setActiveTabIndex(currentIndex - 1);
      }
    },
  };
}
