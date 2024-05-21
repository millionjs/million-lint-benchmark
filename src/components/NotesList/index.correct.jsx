import { useMemo, useState, startTransition } from "react";
import { Button, ButtonGroup } from "@mui/material";
import FilterInput from "../FilterInput";
import NoteButton from "../NoteButton";
import { Virtuoso } from "react-virtuoso";
import "./index.css";

function NotesList({
  notes,
  activeNoteId,
  onNoteActivated,
  onNewNotesRequested,
  onDeleteAllRequested,
}) {
  const [filterInputValue, setFilterInputValue] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const filteredNotes = useMemo(
    () =>
      Object.values(notes)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .filter(({ text }) => {
          if (!filterValue) {
            return true;
          }

          return text.toLowerCase().includes(filterValue.toLowerCase());
        }),
    [notes, filterValue],
  );

  return (
    <div className="notes-list" style={{ position: "relative" }}>
      <div className="notes-list__filter">
        <FilterInput
          filter={filterInputValue}
          onChange={(text) => {
            setFilterInputValue(text);
            startTransition(() => {
              setFilterValue(text);
            });
          }}
          noteCount={Object.keys(notes).length}
        />
      </div>

      <div className="notes-list__notes">
        <Virtuoso
          totalCount={filteredNotes.length}
          itemContent={(index) => {
            const { id, text, date } = filteredNotes[index];
            return (
              <div style={{ paddingBottom: 8 }} key={id}>
                <NoteButton
                  id={id}
                  isActive={activeNoteId === id}
                  onNoteActivated={onNoteActivated}
                  text={text}
                  filterText={filterValue}
                  date={date}
                />
              </div>
            );
          }}
          increaseViewportBy={500}
        />
      </div>

      <div className="notes-list__controls">
        {useMemo(
          () => (
            <>
              <ButtonGroup size="small">
                <Button
                  classes={{ root: "notes-list__control" }}
                  onClick={() => onNewNotesRequested({ count: 1, paragraphs: 1 })}
                >
                  + Note
                </Button>
                <Button
                  classes={{ root: "notes-list__control" }}
                  onClick={() => onNewNotesRequested({ count: 1, paragraphs: 300 })}
                >
                  + Huge
                </Button>
                <Button
                  classes={{ root: "notes-list__control" }}
                  onClick={() => onNewNotesRequested({ count: 100, paragraphs: 1 })}
                >
                  + 100
                </Button>
              </ButtonGroup>
              <ButtonGroup size="small">
                <Button
                  classes={{ root: "notes-list__control" }}
                  onClick={() => onDeleteAllRequested()}
                >
                  Delete all
                </Button>
              </ButtonGroup>
            </>
          ),
          [onNewNotesRequested, onDeleteAllRequested],
        )}
      </div>
    </div>
  );
}

export default NotesList;
