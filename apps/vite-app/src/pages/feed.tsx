import SuggestedUsers from '../components/SuggestedUsers';
import PostList from '../features/post/components/PostList';
import { AddContentButton } from '../features/user/components/AddContentButton';

export default function Feed() {
  return (
    <div className="bg-background text-foreground flex min-h-screen justify-center">
      <div className="container mx-auto flex w-full max-w-5xl gap-6 px-2  md:px-4 py-6">
        <div className="flex w-full flex-col lg:w-2/3">
          <div className="sticky top-0 bg-background z-10 pt-2 pb-4">
            <AddContentButton />
          </div>
          <div className="mt-6">
            <PostList />
          </div>
        </div>

        <div className="hidden w-1/3 lg:block">
          <div className="sticky top-24">
            <SuggestedUsers layout="vertical" />
          </div>
        </div>
      </div>
    </div>
  );
}
