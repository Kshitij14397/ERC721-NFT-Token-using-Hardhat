const {expect} = require("chai");
const { ethers } = require("hardhat");

describe("Token", function(){

    let Token;
    let hardhatToken;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function(){

        Token = await ethers.getContractFactory("ERC721_NFT");
        hardhatToken = await Token.deploy();
        [owner, addr1, addr2] = await ethers.getSigners();
        
    });


    describe("ERC721Enumerable", function(){

        describe("TotalSupply()", function(){
        
            it("Total Supply must increase after minting a token", async function(){
                let initialTokenSupply=await hardhatToken.totalSupply();
                await hardhatToken.safeMint(addr1.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                expect(await hardhatToken.totalSupply()).to.equal((initialTokenSupply+1));
            })
            
        })
    
        describe("tokenByIndex()", function(){
    
            it("Returns a token ID at a given index of all the tokens stored by the contract.", async function(){
                await hardhatToken.safeMint(owner.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                await hardhatToken.safeMint(owner.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                await hardhatToken.safeMint(owner.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                
                expect(await hardhatToken.tokenByIndex(2)).to.equal(2);
                await expect(hardhatToken.tokenByIndex(6)).to.be.revertedWith("ERC721Enumerable: global index out of bounds");
                
            })
        })
    
        describe("tokenOfOwnerByIndex()", function(){
    
            it("Returns a token ID owned by owner at a given index of its token list.", async function(){
                
                await hardhatToken.safeMint(owner.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                await hardhatToken.safeMint(owner.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                await hardhatToken.safeMint(owner.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                
                await hardhatToken.safeMint(addr1.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                await hardhatToken.safeMint(addr1.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                
                expect(await hardhatToken.tokenOfOwnerByIndex(addr1.address, 1)).to.equal(4);
                await expect(hardhatToken.tokenOfOwnerByIndex(addr1.address, 6)).to.be.revertedWith("ERC721Enumerable: owner index out of bounds");
                
                console.log(await hardhatToken.tokenOfOwnerByIndex(addr1.address, 0));
            })
        })
    })

    describe("ERC721URIStorage", function(){

        describe("tokenURI()", function(){

            it("tokenURI() returns the Uniform Resource Identifier (URI) for tokenId token.", async function(){

                await hardhatToken.safeMint(owner.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                
                console.log("TokenURI for Token ID 0: ",await hardhatToken.tokenURI(0));
                await expect(hardhatToken.tokenURI(1)).to.be.revertedWith("ERC721URIStorage: URI query for nonexistent token");
            })
            
        })
    })

    describe("ERC721Burnable", function(){

        describe("burn()", function(){

            it("Burns tokenId.", async function(){

                await hardhatToken.safeMint(owner.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                //await hardhatToken.safeMint(owner.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                
                await expect(hardhatToken.connect(addr1).burn(0)).to.be.revertedWith("ERC721Burnable: caller is not owner nor approved");
                console.log("True",await hardhatToken.burn(0));
            })
        })
    })

    describe("ERC721", function(){

        describe("deployment", function(){

            it("Token Name should be equal to MyToken", async function(){
                expect(await hardhatToken.name()).to.equal("MyToken");
            });
    
            
            it("Token Symbol should be equal to MTK", async function(){
                expect(await hardhatToken.symbol()).to.equal("MTK");
            });


        });

        describe("mint", function(){

            it("Only Owner can mint a token", async function(){
            
                await expect(hardhatToken.connect(addr1).safeMint(owner.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR")).to.be.revertedWith("Ownable: caller is not the owner");
        
            });
    
            it("To cannot be the zero address in mint()", async function(){
    
                await expect(hardhatToken.safeMint("0x0000000000000000000000000000000000000000", "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR")).to.be.revertedWith("ERC721: mint to the zero address");
        
            })
    
        /*    it("Token ID must not exist", async function(){
                await hardhatToken.safeMint(addr1.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                await expect(hardhatToken.safeMint(addr1.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR")).to.be.revertedWith("ERC721: token already minted");
        
            });*/
    
        });
        
        describe("balanceOf()", function(){
        
            it("Balance of Address 1 should increase after minting", async function(){
                let initialBalance=await hardhatToken.balanceOf(addr1.address);
                await hardhatToken.safeMint(addr1.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                expect(await hardhatToken.balanceOf(addr1.address)).to.equal((initialBalance+1));
            })
    
        })
    
        describe("Ownerof()", function(){
    
            it("OwnerOf() should work correctly after minting", async function(){
    
                await hardhatToken.safeMint(addr1.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                await expect(hardhatToken.ownerOf(1)).to.be.revertedWith("ERC721: owner query for nonexistent token");
                    
            })
        
        
        })
     
        describe("describe()", function(){

            it("The caller cannot approve himself.", async function(){
                
                await hardhatToken.safeMint(owner.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                await expect(hardhatToken.approve(owner.address, 0)).to.be.revertedWith("ERC721: approval to current owner");               
            })

            it("tokenId must exist.", async function(){
              
                await expect(hardhatToken.approve(addr1.address, 0)).to.be.revertedWith("ERC721: owner query for nonexistent token");               
                
            })

            it("The caller must own the token.", async function(){
              
                await hardhatToken.safeMint(addr1.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                await expect(hardhatToken.approve(addr2.address, 0)).to.be.revertedWith("ERC721: approve caller is not owner nor approved for all");               
                
            })

            it("The caller must be an approved operator.", async function(){
              
                await hardhatToken.safeMint(owner.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                await hardhatToken.safeMint(owner.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                
                await hardhatToken.setApprovalForAll(addr1.address, true);              
                await hardhatToken.connect(addr1).approve(addr2.address, 0);               
                
            })

        })
  
        describe("getApproved()", function(){

            it("tokenId must exist.", async function(){
                
                await hardhatToken.safeMint(owner.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                
                await hardhatToken.approve(addr1.address, 0);
                
                await expect(hardhatToken.getApproved(1)).to.be.revertedWith("ERC721: approved query for nonexistent token");
                
                expect(await hardhatToken.getApproved(0)).to.equal(addr1.address);
                
            })
        })

        describe("setApprovalForAll()", function(){
           
            it("The operator cannot be the caller.", async function(){
                
                await hardhatToken.safeMint(owner.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                await hardhatToken.safeMint(owner.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                
                await expect(hardhatToken.setApprovalForAll(owner.address, true)).to.be.revertedWith("ERC721: approve to caller");              
                
            })
        })

        describe("isApprovedForAll()", function(){
            
            it("Returns if the operator is allowed to manage all of the assets of owner.", async function(){

                await hardhatToken.safeMint(owner.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                await hardhatToken.safeMint(owner.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                await hardhatToken.setApprovalForAll(addr1.address, true);
    
                expect(await hardhatToken.isApprovedForAll(owner.address, addr1.address)).to.be.equal(true);
    
            })
            
        })

        describe("safeTransferFrom", function(){

            it("from cannot be the zero address.", async function(){
                await hardhatToken.safeMint(owner.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                
                await expect(hardhatToken.transferFrom("0x0000000000000000000000000000000000000000", addr1.address, 0)).to.be.revertedWith("ERC721: transfer of token that is not own");

              //  console.log(owner.address);
            })
        
            it("it cannot be the zero address.", async function(){
                await hardhatToken.safeMint(owner.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                
                await expect(hardhatToken.transferFrom(owner.address, "0x0000000000000000000000000000000000000000", 0)).to.be.revertedWith("ERC721: transfer to the zero address");

              //  console.log(owner.address);
            })

            it("tokenId must exist", async function(){
               
                await hardhatToken.safeMint(owner.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                
                await expect(hardhatToken.transferFrom(owner.address, addr1.address, 1)).to.be.revertedWith("ERC721: operator query for nonexistent token");

            })

            it("tokenId token must be owned by from", async function(){
               
                await hardhatToken.safeMint(owner.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                await hardhatToken.safeMint(addr2.address, "https://gateway.pinata.cloud/ipfs/QmQWLPmHnyCPEq9YfEr1nKEhgpwsZbdaxwAU2mFQbMK1eR");
                
                await expect(hardhatToken.transferFrom(owner.address, addr1.address, 1)).to.be.revertedWith("ERC721: transfer caller is not owner nor approved");

            })
        
        })


    })
    

       
    
});
