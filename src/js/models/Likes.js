export default class Likes {
    constructor() {
        this.likes = [];
    }

    getNumberOfLikes() {
        return this.likes.length;
    }

    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);
        this.toLocalStorage();
        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id == id);
        this.likes.splice(index, 1);
        this.toLocalStorage();
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id == id) !== -1;
    }

    toLocalStorage() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    fromLocalStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        if (storage) this.likes = storage;
    }
}