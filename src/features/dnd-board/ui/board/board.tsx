import clsx from "clsx";
import { useBoardStore } from "../../model/use-board-store";
import { BoardColumn } from "./board-column";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useFilterCards } from "../../model/use-filter-cards";

export function Board({ className, searchText }: { className?: string; searchText: string }) {
  const boardStore = useBoardStore();
  const columns = boardStore.useSelector((s) => s.board.cols);
  const moveColumn = boardStore.useSelector((s) => s.moveColumn);
  const moveCard = boardStore.useSelector((s) => s.moveBoardCard);
  const filteredColumns = useFilterCards({searchText, columns});

  return (
    <DragDropContext
      onDragEnd={(e) => {
        if (e.type === "column") {
          if (e.destination) {
            moveColumn(e.source.index, e.destination?.index ?? 0);
          }
        }
        if (e.type === "card") {
          if (e.destination) {
            moveCard(
              {
                colId: e.source.droppableId,
                index: e.source.index,
              },
              {
                colId: e.destination.droppableId,
                index: e.destination.index,
              },
            );
          }
        }
      }}
    >
      <Droppable direction="horizontal" droppableId="board" type="column">
        {({ droppableProps, innerRef, placeholder }) => (
          <div
            {...droppableProps}
            ref={innerRef}
            className={clsx("flex  bg-gray-100 rounded-xl p-4 px-2", className)}
          >
            {filteredColumns.map((col, index) => (
              <BoardColumn key={col.id} col={col} index={index} />
            ))}
            {placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
