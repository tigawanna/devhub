import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { RootLayout } from './pages/index/RootLayout';
import { WelcomePage } from './pages/index/WelcomePage';
import { TestLayout } from './components/test/TestLayout';
import { AuthLayout } from './pages/auth/AuthLayout';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { Test } from './components/test/Test';
import { getUser } from './utils/pb/config';
import { Redirect } from './components/auth/Redirect';
import { ProfileLayout } from './pages/profile/ProfileLayout';
import { Profile } from './pages/profile/Profile';
import { ReactRouterError } from './shared/errorboundary/ReactRouterError';
import { QueryStateWrapper } from './shared/wrappers/QueryStateWrapper';
import { LoaderElipse } from './shared/loaders/Loaders';

function App() {
  const query = useQuery(['user'], getUser);
  const user = query.data;
  // console.log('user , ', user);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout user={user} test_mode />,
      // loader:userLoader(queryClient),
      errorElement: <ReactRouterError />,
      children: [
        { index: true, element: <WelcomePage user={user} /> },

        {
          path: '/auth',
          element: <AuthLayout user={user} />,
          children: [
            {
              index: true,
              element: <Login />,
              // loader: deferredBlogPostsLoader,
            },
            {
              path: '/auth/signup',
              element: <Signup />,
              // loader: blogPostLoader,
            },
          ],
        },
        {
          path: '/redirect',
          element: <Redirect />,
        },
        {
          path: '/profile',
          element: <ProfileLayout user={user} />,
          children: [
            {
              index: true,
              element: <Profile user={user} />,
              // loader: deferredBlogPostsLoader,
            },
          ],
        },

        {
          path: '/test',
          element: <TestLayout user={user} />,
          children: [
            {
              index: true,
              element: <Test user={user} />,
              // loader: deferredBlogPostsLoader,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <QueryStateWrapper query={query} loader={<LoaderElipse />}>
      <div
        className=" dark:bg-slate-900 h-full max-h-screen
       dark:text-white dark:shadow-white"
      >
        <RouterProvider router={router} />
      </div>
    </QueryStateWrapper>
  );
}

export default App;
