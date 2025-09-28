export default function Paginator({ canPrevious, previous, canNext, next }) {
  return (
    <div>
      <button onClick={previous} disabled={!canPrevious}>
        Previous
      </button>
      <button onClick={next} disabled={!canNext}>
        Next
      </button>
    </div>
  );
}
