interface IFeedback {
	id: number;
	name: string;
	score: number;
}

class Feedback implements IFeedback {
	id: number;
	name: string;
	score: number;

	constructor(id: number, name: string, score: number) {
		this.id = id;
		this.name = name;
		this.score = score;
	}

	static scoreList: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	static selectedScore: number = 10;

	static renderScores() {
		const scoreElement = document.getElementById("scoreList") as HTMLElement;
		const scoreHtmls = Feedback.scoreList.map(score => {
			return `
				<div id="scoreInput" class="crile-1 ${Feedback.selectedScore === score ? "btn-selected" : ""}" onclick="Feedback.getScore(${score})">${score}</div>
			`;
		});

		scoreElement.innerHTML = scoreHtmls.join("");
	}

	static getScore(scoreNumber: number) {
		Feedback.selectedScore = scoreNumber;
		Feedback.renderScores();
	}

	static createFeedback() {
		const commentInput = document.getElementById("sendComment") as HTMLInputElement;
		const renderComment: any = document.getElementById("commentList");

		let feedbackList: IFeedback[] = JSON.parse(localStorage.getItem("feedbackList") || "[]");

		const newFeedback: IFeedback = {
			id: Math.floor(Math.random() * 1000),
			name: commentInput.value,
			score: Feedback.selectedScore,
		};

		if (commentInput.value !== "") {
			feedbackList.push(newFeedback);
			localStorage.setItem("feedbackList", JSON.stringify(feedbackList));
			commentInput.value = "";
			Feedback.renderScores();
			renderComment.innerHTML = "";
			Feedback.renderFeedback();
		}
	}

	static updateFeedback(feedbackId: number) {
		let feedbackList: IFeedback[] = JSON.parse(localStorage.getItem("feedbackList") || "[]");

		const renderComment: any = document.getElementById("commentList");
		const index = feedbackList.findIndex(feedback => feedback.id === feedbackId);

		if (index !== -1) {
			const updatedText = prompt("Sửa feedback: ", feedbackList[index].name);

			if (updatedText !== null) {
				feedbackList[index].name = updatedText;
				localStorage.setItem("feedbackList", JSON.stringify(feedbackList));
				renderComment.innerHTML = "";
				Feedback.renderFeedback();
			}
		}
	}

	static deleteFeedback(feedbackId: number) {
		let feedbackList: IFeedback[] = JSON.parse(localStorage.getItem("feedbackList") || "[]");

		const renderComment: any = document.getElementById("commentList");
		const index = feedbackList.findIndex(feedback => feedback.id === feedbackId);

		if (index !== -1) {
			Swal.fire({
				title: 'Bạn có chắc chắn muốn xóa không?',
				showDenyButton: true,
				showCancelButton: true,
				confirmButtonText: `Xóa`,
				denyButtonText: `Hủy`,
			}).then((result) => {
				if (result.isConfirmed) {
					feedbackList.splice(index, 1);
					localStorage.setItem("feedbackList", JSON.stringify(feedbackList));
					renderComment.innerHTML = "";
					Feedback.renderFeedback();
				}
			});
		}
	}

	static renderFeedback() {
		let feedbackList: IFeedback[] = JSON.parse(localStorage.getItem("feedbackList") || "[]");

		const renderComment: any = document.getElementById("commentList");

		feedbackList.forEach(feedback => {
			renderComment.innerHTML += `
				<div class="comment">
					<div class="crile-2">${feedback.score}</div>
					<div class="renderFeedback">
						<span id="show">${feedback.name}</span>
						<div class="icon">
							<div style="cursor: pointer;" onclick="Feedback.updateFeedback(${feedback.id})">
								<i class="fas fa-pen-to-square"></i>
							</div>
							<div style="cursor: pointer;" onclick="Feedback.deleteFeedback(${feedback.id})">
								<i class="fas fa-times"></i>
							</div>
						</div>
					</div>
				</div>
			`;
		});
	}
}

// Gọi các phương thức cần thiết từ lớp Feedback để khởi tạo ứng dụng
Feedback.renderScores();
Feedback.renderFeedback();
Feedback.createFeedback();

// Thêm hàm để gọi các phương thức xóa và sửa feedback từ HTML
function deleteFeedbacks(id: number): void {
	Feedback.deleteFeedback(id);
}

function updateFeedbacks(id: number) {
	Feedback.updateFeedback(id);
}
