

export let randomString=(length:number)=> {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}




export const createUserForTesting = (loginLen:number,emailLen:number,passwordLen:number) => {
    return{
        login: randomString(loginLen),
        email: randomString(emailLen)+"test@email.test",
        password: randomString(passwordLen)
    }
}



export const createPostForTesting = (
    titleLen: number,
    shortDescriptionLen: number,
    contentLen: number,
    blogId: string,
) => {
    return {
        title: randomString(titleLen),
        shortDescription: randomString(shortDescriptionLen),
        content: randomString(contentLen),
        blogId: blogId,
    };
};

export const createContentCommentForTesting = (contentLen: number) => {
    return {
        content: randomString(contentLen),
    };
};

export const createOutputCommentForTesting = (
    contentLen: number,
    userId: string,
    userLogin: string,
    likesCount: number,
    dislikesCount: number,
    myStatus: string,
) => {
    return {
        id: expect.any(String),
        content: randomString(contentLen),
        userId: userId,
        userLogin: userLogin,
        createdAt: expect.any(String),
        likesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: myStatus,
        },
    };
};




export const creatingBlogForTests = (nameLen:number,descriptionLen:number,correct:boolean) => {
    let url
    if (correct){
        url="https://www.somesite.com/"+randomString(5)
    }
    else{
        url=""
    }
    return{
        name: randomString(nameLen),
        description: randomString(descriptionLen),
        websiteUrl: url
    }
}

export const createPostForTestingInBlogs = (titleLen:number,shortDescriptionLen:number,contentLen:number,blogId:string) => {
    return{
        title: randomString(titleLen),
        shortDescription: randomString(shortDescriptionLen),
        content: randomString(contentLen),
        blogId:blogId
    }

}

export const emptyAllBlogsDbReturnData={
    pagesCount: 0,
    page: 1,
    pageSize: 10,
    totalCount: 0,
    items: []
}

export const createDbReturnDataForAllBlogs = (pagesCount:number,page:number,pageSize:number,totalCount:number,blogs:object) => {
    return{
        pagesCount: pagesCount,
        page: page,
        pageSize: pageSize,
        totalCount: totalCount,
        items: [blogs]
    }
}