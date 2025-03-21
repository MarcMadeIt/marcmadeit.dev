import "./Pagination.scss";

function Pagination({
  postsPerPage,
  totalCount,
  handlePagination,
  currentPage,
}) {
  const totalPages = Math.ceil(totalCount / postsPerPage);
  const paginationNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      {paginationNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          className={currentPage === pageNumber ? "active" : ""}
          onClick={() => handlePagination(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}
    </div>
  );
}

export default Pagination;
