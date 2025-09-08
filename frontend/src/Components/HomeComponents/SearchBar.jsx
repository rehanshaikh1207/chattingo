import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsFilter } from 'react-icons/bs';

const SearchBar = ({ querys, setQuerys, handleSearch }) => {
  return (
    <div className="p-4 border-b border-white/10">
      <div className="relative flex items-center space-x-3">
        <div className="relative flex-1">
          <input
            className="w-full py-3 pl-12 pr-4 bg-white/10 border border-white/20 rounded-full outline-none text-white placeholder-white/50 focus:border-blue-400 focus:bg-white/20 transition-all"
            type="text"
            placeholder="Search or start new chat..."
            onChange={(e) => {
              setQuerys(e.target.value);
              handleSearch(e.target.value);
            }}
            value={querys}
          />
          <AiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 text-lg" />
        </div>
        <button className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all hover:scale-105">
          <BsFilter className="text-white/70 text-lg" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
