pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CodaCollectible is ERC721, ERC721Enumerable, ERC721URIStorage {

  using Counters for Counters.Counter;

  Counters.Counter private _tokenIds;

  constructor() ERC721("CodaCollectible", "CCB") {
  }

   function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

// 必须声明override，因为两个baseclass都定义了这个方法
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

  function _baseURI() internal view virtual override returns (string memory) {
      return "";
  }


  function mintItem(address to, string memory tokenUri)
     public  
     returns (uint256)
  {
    _tokenIds.increment();

    uint256 tokenId = _tokenIds.current();
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, tokenUri);

    return tokenId;
  }

   
}
