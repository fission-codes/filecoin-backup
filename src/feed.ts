
export type Post = { title: string, url: string }

export async function getPosts(): Promise<Post[]> {
  const res = await fetch('https://talk.fission.codes/c/projects/webnative-filecoin-integration/48.json');
  const json: any = await res.json();

  if (res.ok) {
    const topics = json.topic_list.topics;
    let posts: Post[] = [];

    topics.forEach((topic: any) => {
      posts.push({
        title: topic.title,
        url: 'https://talk.fission.codes/t/' + topic.slug
      });
    });

    return posts.slice(0, 6).reverse();
  } else {
    throw new Error('Could not load most recent posts');
  }
}


