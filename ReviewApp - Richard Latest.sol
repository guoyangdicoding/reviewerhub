// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CompanyReviewSystem {
    struct Review {
        address user;
        string companyName;
        string reviewText;
        string date;
        string userName;
        uint8 rating;
        uint256 up_votes;
        uint256 down_votes;
    }

    struct Company {
        string name;
        uint256 totalRating;
        uint256 numberOfReviews;
    }

    address public owner;
    uint256 public reviewFee;

    mapping(string => Company) public companies;
    mapping(string => Review[]) public companyReviews;
    mapping(string => mapping(uint256 => mapping(address => bool))) public reviewUpVotes;
    mapping(string => mapping(uint256 => mapping(address => bool))) public reviewDownVotes;

    event ReviewSubmitted(string companyName, address user, uint8 rating);
    event ReviewUpVoted(string companyName, uint256 reviewId, address user);
    event ReviewDownVoted(string companyName, uint256 reviewId, address user);
    event FeeUpdated(uint256 newFee);
    event Withdrawal(address indexed owner, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor(uint256 _initialFee) {
        owner = msg.sender;
        reviewFee = _initialFee;
    }

    function submitReview(
        string memory _companyName,
        string memory _reviewText,
        string memory _date,
        string memory _userName,
        uint8 _rating
    ) public payable {
        require(msg.value >= reviewFee, "Insufficient fee to submit review");
        require(_rating > 0 && _rating <= 5, "Rating must be between 1 and 5 stars");

        Review memory newReview = Review({
            user: msg.sender,
            companyName: _companyName,
            reviewText: _reviewText,
            date: _date,
            userName: _userName,
            rating: _rating,
            up_votes: 0,
            down_votes: 0
        });

        companyReviews[_companyName].push(newReview);

        if (bytes(companies[_companyName].name).length == 0) {
            companies[_companyName] = Company({
                name: _companyName,
                totalRating: _rating,
                numberOfReviews: 1
            });
        } else {
            companies[_companyName].totalRating += _rating;
            companies[_companyName].numberOfReviews += 1;
        }

        emit ReviewSubmitted(_companyName, msg.sender, _rating);
    }

    function upVoteReview(
        string memory _companyName,
        uint256 _reviewIndex
    ) public {
        require(_reviewIndex < companyReviews[_companyName].length, "Invalid review index");
        require(!reviewUpVotes[_companyName][_reviewIndex][msg.sender], "You have already up-voted this review");

        reviewUpVotes[_companyName][_reviewIndex][msg.sender] = true;
        companyReviews[_companyName][_reviewIndex].up_votes += 1;

        emit ReviewUpVoted(_companyName, _reviewIndex, msg.sender);
    }

    function downVoteReview(
        string memory _companyName,
        uint256 _reviewIndex
    ) public {
        require(_reviewIndex < companyReviews[_companyName].length, "Invalid review index");
        require(!reviewDownVotes[_companyName][_reviewIndex][msg.sender], "You have already down-voted this review");

        reviewDownVotes[_companyName][_reviewIndex][msg.sender] = true;
        companyReviews[_companyName][_reviewIndex].down_votes += 1;

        emit ReviewDownVoted(_companyName, _reviewIndex, msg.sender);
    }

    function getAverageRating(
        string memory _companyName
    ) public view returns (uint256) {
        require(bytes(companies[_companyName].name).length != 0, "Company does not exist");

        Company memory company = companies[_companyName];
        return (company.totalRating * 10) / company.numberOfReviews;
    }

    function getCompanyReviews(
        string memory _companyName
    ) public view returns (Review[] memory) {
        return companyReviews[_companyName];
    }

    function updateReviewFee(uint256 _newFee) public onlyOwner {                                                          
        reviewFee = _newFee; 
        emit FeeUpdated(_newFee);
    }

    function withdrawFees() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");

        (bool success, ) = owner.call{value: balance}("");
        require(success, "Withdrawal failed");

        emit Withdrawal(owner, balance);
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function getReviewFee() public view returns (uint256) {
        return reviewFee;
    }
}