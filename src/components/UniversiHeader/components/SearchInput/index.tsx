import './style.css'
import { MagnifyingGlass } from "phosphor-react";


export function SearchInput() {
  return (
    <div className="search-input-container">
      <input placeholder="Pesquisar..." />
      <button className='search-button'>
        <MagnifyingGlass />
      </button>
    </div>
  );
}
