import React from 'react';

import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import Wrapper from '../assets/wrappers/PageButtonContainer';
import { useDispatch } from 'react-redux';

const PageButtonContianer = ({ totalPages, page, setPage }) => {
  const dispatch = useDispatch();

  const range = (start, end) =>
    [...Array(end - start + 1)].map((_, i) => start + i);

  const shift = Math.min(totalPages - 10, Math.max(0, Math.ceil(page - 5.5)));
  const pages = range(Math.max(1, 1 + shift), Math.min(totalPages, 10 + shift));

  const nextPage = (e) => {
    e.preventDefault();
    dispatch(setPage({ page: Math.min(page + 1, totalPages) }));
  };

  const prevPage = (e) => {
    e.preventDefault();
    dispatch(setPage({ page: Math.max(page - 1, 1) }));
  };

  return (
    <Wrapper>
      <button type='button' className='prev-btn' onClick={prevPage}>
        <HiChevronDoubleLeft />
        prev
      </button>
      <div className='btn-container'>
        {pages.map((pageNumber) => (
          <button
            type='button'
            key={pageNumber}
            className={pageNumber === page ? 'pageBtn active' : 'pageBtn'}
            onClick={() => dispatch(setPage({ page: pageNumber }))}
          >
            {pageNumber}
          </button>
        ))}
      </div>
      <button type='button' className='next-btn' onClick={nextPage}>
        next
        <HiChevronDoubleRight />
      </button>
    </Wrapper>
  );
};

export default PageButtonContianer;
