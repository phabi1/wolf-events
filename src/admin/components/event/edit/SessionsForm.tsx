import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import useModal from "../../../hooks/use-modal";
import UiCollection from "../../ui/Collection";
import ItemDialog from "./sessions/SessionDialog";

export function SessionItem({
  item,
  index,
  control,
}: {
  item: any;
  index: number;
  control: any;
}) {
  return (
    <div>
      {item.title} - {item.start_date} to {item.end_date}
    </div>
  );
}

export default function EventSessionsForm() {
  const { control, watch, setValue } = useFormContext();
  const items = watch("sessions");

  const { isOpen, openModal, closeModal } = useModal();
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null,
  );

  const selectedItem = useMemo(() => {
    if (selectedItemIndex !== null && items) {
      return items[selectedItemIndex];
    }
    return null;
  }, [selectedItemIndex, items]);

  const handleAddItem = () => {
    const newItem = {
      title: "",
      start_date: "",
      end_date: "",
    };
    setValue("sessions", [...(items || []), newItem]);
    setSelectedItemIndex(items ? items.length : 0);
    openModal();
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...(items || [])];
    updatedItems.splice(index, 1);
    setValue("sessions", updatedItems);
  };

  const handleItemDialogClose = (data: any | null) => {
    if (data !== null && selectedItemIndex !== null) {
      const updatedItems = [...(items || [])];
      updatedItems[selectedItemIndex] = data;
      setValue("sessions", updatedItems);
    }
    closeModal();
  };

  return (
    <div>
      <UiCollection
        items={items}
        renderItem={(item: any, index: number) => (
          <SessionItem item={item} index={index} control={control} />
        )}
        onAddItem={handleAddItem}
        onRemoveItem={handleRemoveItem}
        onItemClicked={(index) => {
          setSelectedItemIndex(index);
          openModal();
        }}
        onMoveItems={(items) => {
          setValue("sessions", items);
        }}
      />
      <ItemDialog
        isOpen={isOpen}
        selectedItem={selectedItem}
        onClose={handleItemDialogClose}
      />
    </div>
  );
}
