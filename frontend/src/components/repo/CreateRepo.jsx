import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

const CreateRepo = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true); // true = Public, false = Private
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setErrorMsg("");
    setLoading(true);

    const userId = localStorage.getItem("userId");

    try {
      await axios.post("http://localhost:3002/repo/create", {
        name: name.trim(),
        description: description.trim(),
        visibility: visibility,
        owner: userId,
      });

      setLoading(false);
      navigate("/");
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.message || "Failed to create repository. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body-base text-body-base antialiased bg-background">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-md sm:p-lg mt-12">
        <div className="w-full max-w-[600px] glass-panel rounded-lg p-lg shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary-container opacity-10 blur-3xl rounded-full pointer-events-none group-hover:opacity-20 transition-opacity duration-1000"></div>

          <header className="mb-xl border-b border-outline-variant pb-md flex items-center gap-sm">
            <span
              className="material-symbols-outlined text-primary-container text-2xl"
              data-icon="book_4"
            >
              book_4
            </span>
            <h1 className="font-headline-md text-headline-md text-on-surface">
              Create a new repository
            </h1>
          </header>

          {errorMsg && (
            <div className="flex items-start gap-sm p-sm mb-lg bg-error-container/20 border border-error-container rounded text-error font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">
                error
              </span>
              <p>{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-lg">
            {/* Owner & Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_2fr] gap-md items-end">
              <div className="space-y-xs">
                <label
                  className="block font-body-sm text-body-sm text-on-surface-variant font-medium"
                  htmlFor="owner"
                >
                  Owner <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <select
                    className="w-full appearance-none bg-[#0c1116] border border-[#30363d] rounded text-on-surface py-2 pl-sm pr-lg input-glow font-code-base text-code-base transition-colors duration-200"
                    id="owner"
                    name="owner"
                    disabled
                  >
                    <option>Your Account</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline text-sm pointer-events-none">
                    arrow_drop_down
                  </span>
                </div>
              </div>

              <div className="hidden md:flex pb-2 text-outline-variant font-code-lg font-light select-none">
                /
              </div>

              <div className="space-y-xs">
                <label
                  className="block font-body-sm text-body-sm text-on-surface-variant font-medium"
                  htmlFor="repo-name"
                >
                  Repository name <span className="text-error">*</span>
                </label>
                <input
                  className="w-full bg-[#0c1116] border border-[#30363d] rounded text-on-surface py-2 px-sm input-glow font-code-base text-code-base placeholder:text-outline transition-colors duration-200"
                  id="repo-name"
                  name="repo-name"
                  placeholder="app-core-service"
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
              Great repository names are short and memorable. Need inspiration? How about{" "}
              <span className="font-code-sm text-code-sm text-secondary">
                glorious-waffle
              </span>
              ?
            </p>

            {/* Description */}
            <div className="space-y-xs mt-lg">
              <label
                className="block font-body-sm text-body-sm text-on-surface-variant flex items-center justify-between"
                htmlFor="description"
              >
                <span className="font-medium">Description</span>
                <span className="text-outline text-xs">Optional</span>
              </label>
              <textarea
                className="w-full bg-[#0c1116] border border-[#30363d] rounded text-on-surface py-2 px-sm input-glow font-body-base text-body-base resize-y min-h-[60px] transition-colors duration-200"
                id="description"
                name="description"
                rows="2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <hr className="border-outline-variant my-lg" />

            {/* Visibility */}
            <div className="space-y-md">
              <h2 className="font-body-base text-body-base font-semibold text-on-surface">
                Visibility
              </h2>
              <div className="space-y-sm">
                {/* Public Option */}
                <label
                  className={`relative flex cursor-pointer rounded-lg border border-[#30363d] bg-[#0c1116] p-4 hover:bg-surface-container-low transition-colors duration-200 ${
                    visibility ? "border-primary-container bg-[rgba(88,166,255,0.05)]" : ""
                  }`}
                  onClick={() => setVisibility(true)}
                >
                  <div className="flex items-start gap-md w-full">
                    <div className="flex items-center h-5 mt-1">
                      <input
                        checked={visibility === true}
                        onChange={() => setVisibility(true)}
                        className="radio-custom h-4 w-4 border-[#30363d] bg-transparent text-primary-container focus:ring-primary-container focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer"
                        name="visibility"
                        type="radio"
                        value="public"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-xs mb-xs">
                        <span className="material-symbols-outlined text-primary-container">
                          public
                        </span>
                        <span className="font-body-base text-body-base font-semibold text-on-surface">
                          Public
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Anyone on the internet can see this repository. You choose who can commit.
                      </p>
                    </div>
                  </div>
                </label>

                {/* Private Option */}
                <label
                  className={`relative flex cursor-pointer rounded-lg border border-[#30363d] bg-[#0c1116] p-4 hover:bg-surface-container-low transition-colors duration-200 ${
                    !visibility ? "border-primary-container bg-[rgba(88,166,255,0.05)]" : ""
                  }`}
                  onClick={() => setVisibility(false)}
                >
                  <div className="flex items-start gap-md w-full">
                    <div className="flex items-center h-5 mt-1">
                      <input
                        checked={visibility === false}
                        onChange={() => setVisibility(false)}
                        className="radio-custom h-4 w-4 border-[#30363d] bg-transparent text-primary-container focus:ring-primary-container focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer"
                        name="visibility"
                        type="radio"
                        value="private"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-xs mb-xs">
                        <span className="material-symbols-outlined text-outline">
                          lock
                        </span>
                        <span className="font-body-base text-body-base font-semibold text-on-surface">
                          Private
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        You choose who can see and commit to this repository.
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <hr className="border-outline-variant my-lg" />

            {/* Submit */}
            <div className="pt-sm flex justify-end gap-sm">
              <button
                className="px-lg py-2 rounded font-body-sm text-body-sm font-medium border border-[#30363d] text-on-surface-variant hover:text-on-surface hover:border-outline transition-colors duration-200"
                type="button"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
              <button
                className="btn-primary px-lg py-2 rounded font-body-sm text-body-sm font-medium flex items-center gap-xs transition-colors duration-200 disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                <span className="material-symbols-outlined text-sm">add</span>
                {loading ? "Creating..." : "Create Repository"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateRepo;
