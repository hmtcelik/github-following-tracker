import { IconBrandGithub, IconMoon, IconSun } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";

export type FollowerResponseData = {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
};

const App = () => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [darkMode, setDarkMode] = useState(prefersDark);

  const [username, setUsername] = useState("");
  const [errorMsq, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const [followers, setFollowers] = useState<FollowerResponseData[]>([]);
  const [followingStatus, setFollowingStatus] = useState<
    Record<string, boolean>
  >({});

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (username.trim() === "") {
      setErrorMsg("Please enter a username");
      return;
    }

    setErrorMsg("");
    setLoading(false);

    axios
      .get(
        `https://api.github.com/users/${username}/following?per_page=10&page=${page}`
      )
      .then((res) => {
        if (res.data.length <= 0) {
          setErrorMsg("User not found");
        }
        setFollowers(res.data);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 404) {
          setErrorMsg("User not found");
          return;
        } else {
          setErrorMsg("The quota exceeded, Please try again later");
        }
        setFollowers([]);
      });
  };

  const checkIfFollow = async (user: string) => {
    const res = await axios.get(
      `https://api.github.com/users/${user}/following/${username}`
    );
    if (res.status === 204) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const fetchFollowingStatus = async () => {
      const statusObject: Record<string, boolean> = {};
      await Promise.all(
        followers.map(async (user) => {
          try {
            const isFollowing = await checkIfFollow(user.login);
            statusObject[user.login] = isFollowing;
          } catch (error) {
            console.error(
              `Error checking follow status for ${user.login}:`,
              error
            );
          }
        })
      );
      setFollowingStatus((prevStatus) => ({ ...prevStatus, ...statusObject }));
    };

    fetchFollowingStatus();
  }, [followers]);

  return (
    <div className={darkMode ? "dark" : ""}>
      {/* Navbar */}
      <header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white border-b border-gray-200 text-sm py-3 sm:py-0 dark:bg-[#0F172A]  dark:border-gray-700">
        <nav
          className="relative max-w-7xl flex flex-wrap basis-full  w-full mx-auto px-4 sm:flex items-center sm:justify-end sm:px-6 lg:px-8 "
          aria-label="Global"
        >
          <div className="flex flex-row gap-y-4 gap-x-0 sm:flex-row items-center sm:justify-end sm:gap-y-0 sm:gap-x-7 sm:mt-0 sm:pl-7">
            <a
              className="font-medium text-black px-0 sm:py-6 sm:px-0 dark:text-white"
              href="https://github.com/hmtcelik/github-following-tracker"
              target="_blank"
              aria-current="page"
            >
              <IconBrandGithub />
            </a>
            <div
              className="font-medium text-black cursor-pointer px-6 sm:py-6 sm:px-0 dark:text-white"
              aria-current="page"
              onClick={toggleDarkMode}
            >
              {darkMode ? <IconSun /> : <IconMoon />}
            </div>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden dark:bg-[#0F172A] min-h-screen">
        <div
          className={`max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 ${
            followers.length > 0 ? "py-0" : "sm:py-24"
          }`}
        >
          <div className="text-center">
            {!(followers.length > 0) && (
              <>
                <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 dark:text-gray-200">
                  Github Following Tracker
                </h1>
                <p className="mt-3 text-gray-600 dark:text-gray-400">
                  Enter your github username to get your following info.
                </p>
              </>
            )}
            <div className="mt-7 sm:mt-12 mx-auto max-w-xl relative">
              {followers.length > 0 && (
                <h1 className="text-xl sm:text-2xl mb-2 font-bold text-gray-800 dark:text-gray-200">
                  Github Follower Tracker
                </h1>
              )}
              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="relative z-10 flex space-x-3 p-3 bg-white border rounded-lg shadow-lg shadow-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-900/[.2]">
                  <div className="flex-[1_0_0%]">
                    <label
                      htmlFor="hs-search-article-1"
                      className="block text-sm text-gray-700 font-medium dark:text-white"
                    >
                      <span className="sr-only">Github username</span>
                    </label>
                    <input
                      type="text"
                      id="username"
                      className="p-3 block w-full border-transparent rounded-md focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-400"
                      placeholder="your_github_username"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="flex-[0_0_auto]">
                    <button className="p-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </form>
              {/* End Form */}
              {/* SVG Element */}
              {!(followers.length > 0) && (
                <>
                  <div className="hidden md:block absolute top-0 right-0 -translate-y-12 translate-x-20">
                    <svg
                      className="w-16 h-auto text-orange-500"
                      width={121}
                      height={135}
                      viewBox="0 0 121 135"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164"
                        stroke="currentColor"
                        strokeWidth={10}
                        strokeLinecap="round"
                      />
                      <path
                        d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5"
                        stroke="currentColor"
                        strokeWidth={10}
                        strokeLinecap="round"
                      />
                      <path
                        d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874"
                        stroke="currentColor"
                        strokeWidth={10}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  {/* End SVG Element */}
                  {/* SVG Element */}
                  <div className="hidden md:block absolute bottom-0 left-0 translate-y-10 -translate-x-32">
                    <svg
                      className="w-40 h-auto text-cyan-500"
                      width={347}
                      height={188}
                      viewBox="0 0 347 188"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 82.4591C54.7956 92.8751 30.9771 162.782 68.2065 181.385C112.642 203.59 127.943 78.57 122.161 25.5053C120.504 2.2376 93.4028 -8.11128 89.7468 25.5053C85.8633 61.2125 130.186 199.678 180.982 146.248L214.898 107.02C224.322 95.4118 242.9 79.2851 258.6 107.02C274.299 134.754 299.315 125.589 309.861 117.539L343 93.4426"
                        stroke="currentColor"
                        strokeWidth={7}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </>
              )}
              {/* End SVG Element */}
            </div>
            <div>
              {errorMsq && (
                <p className="text-red-500 mt-4 text-sm">{errorMsq}</p>
              )}
              {loading && (
                <>
                  <div
                    className="animate-spin inline-block w-10 h-10 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
                    role="status"
                    aria-label="loading"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                </>
              )}
              {followers.length > 0 && (
                <>
                  {/* Table Section */}
                  <div className="max-w-[50rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
                    {/* Card */}
                    <div className="flex flex-col">
                      <div className="-m-1.5 overflow-x-auto">
                        <div className="p-1.5 min-w-full inline-block align-middle">
                          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700">
                            {/* Header */}
                            <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-gray-700">
                              <div>
                                <h2 className="text-xl text-left font-semibold text-gray-800 dark:text-gray-200">
                                  You are Following
                                </h2>
                              </div>
                            </div>
                            {/* End Header */}
                            {/* Table */}
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {followers.map((user, idx) => {
                                  let isFollowing: boolean | null = null;
                                  if (
                                    Object.keys(followingStatus).includes(
                                      user.login
                                    )
                                  ) {
                                    isFollowing = followingStatus[user.login];
                                  }

                                  return (
                                    <tr key={idx}>
                                      <td className="h-px px-5 w-px whitespace-nowrap">
                                        <div className="pl-6 lg:pl-3 xl:pl-0 pr-6 py-3">
                                          <div className="flex items-center gap-x-3">
                                            <img
                                              className="inline-block h-[2.375rem] w-[2.375rem] rounded-full"
                                              src={user.avatar_url}
                                              alt="pp"
                                            />
                                            <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                                              {user.login}
                                            </span>
                                          </div>
                                        </div>
                                      </td>

                                      <td className="h-px w-px whitespace-nowrap">
                                        <div className="px-6 py-3">
                                          <span
                                            className={`inline-flex items-center gap-1.5 py-0.5 px-2 rounded-full text-xs font-medium ${
                                              isFollowing
                                                ? "bg-green-100"
                                                : "bg-red-100"
                                            } ${
                                              isFollowing
                                                ? "text-green-800"
                                                : "text-yellow-800"
                                            } ${
                                              isFollowing
                                                ? "dark:bg-green-900"
                                                : "dark:bg-yellow-900"
                                            } ${
                                              isFollowing
                                                ? "dark:text-green-200"
                                                : "dark:text-yellow-200"
                                            }`}
                                          >
                                            {isFollowing
                                              ? "Following"
                                              : "Not Following"}
                                          </span>
                                        </div>
                                      </td>

                                      <td className="h-px w-px whitespace-nowrap">
                                        <div className="px-6 py-1.5">
                                          <a
                                            className="inline-flex items-center gap-x-1.5 text-sm text-blue-600 decoration-2 hover:underline font-medium"
                                            href={user.html_url}
                                          >
                                            Unfollow
                                          </a>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                            {/* End Table */}
                            {/* Footer */}
                            <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-gray-700">
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                                    {followers.length}
                                  </span>{" "}
                                  results
                                </p>
                              </div>
                              <div>
                                <div className="inline-flex gap-x-2">
                                  <button
                                    type="button"
                                    className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
                                    onClick={(e) => {
                                      if (page <= 1) return;
                                      setPage(page - 1);
                                      handleSubmit(e);
                                    }}
                                  >
                                    <svg
                                      className="w-3 h-3"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={16}
                                      height={16}
                                      fill="currentColor"
                                      viewBox="0 0 16 16"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                                      />
                                    </svg>
                                    Prev
                                  </button>
                                  <button
                                    type="button"
                                    className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
                                    onClick={(e) => {
                                      setPage(page + 1);
                                      handleSubmit(e);
                                    }}
                                  >
                                    Next
                                    <svg
                                      className="w-3 h-3"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={16}
                                      height={16}
                                      fill="currentColor"
                                      viewBox="0 0 16 16"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                            {/* End Footer */}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* End Card */}
                  </div>
                  {/* End Table Section */}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* End Hero */}
      <div />
    </div>
  );
};

export default App;
