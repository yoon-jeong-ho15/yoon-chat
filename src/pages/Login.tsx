import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";
import GradientContainer from "../components/common/GradientContainer";
import { GoogleIcon } from "../assets/Icon";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (isSignUp) {
      const result = await signup(email, password, username);
      if (result.success) {
        setSuccess("회원가입이 완료되었습니다. 이메일을 확인해주세요.");
        // Reset form
        setEmail("");
        setPassword("");
        setUsername("");
        // Switch to login mode after a delay
        setTimeout(() => {
          setIsSignUp(false);
          setSuccess("");
        }, 3000);
      } else {
        setError(result.error || "회원가입에 실패했습니다.");
      }
    } else {
      const result = await login(email, password);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.error || "로그인에 실패했습니다.");
      }
    }

    setIsLoading(false);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setSuccess("");
    setEmail("");
    setPassword("");
    setUsername("");
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);
    const result = await loginWithGoogle();
    if (!result.success) {
      setError(result.error || "Google 로그인에 실패했습니다.");
      setIsLoading(false);
    }
    // Don't set isLoading to false on success, as we're redirecting
  };

  return (
    <div className="flex w-full h-full items-center justify-center">
      <GradientContainer>
        <div className="bg-white p-8 rounded-xl w-96">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed mb-4"
          >
            <GoogleIcon className="size-7" />
            <span className="text-gray-700 font-medium">Google로 계속하기</span>
          </button>

          {/* Divider */}
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">또는</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  사용자 이름
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="홍길동"
                  disabled={isLoading}
                  required
                />
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="example@email.com"
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={isSignUp ? "6자리 이상" : "비밀번호"}
                disabled={isLoading}
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            {success && (
              <div className="text-green-500 text-sm text-center">
                {success}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {isLoading
                ? isSignUp
                  ? "회원가입 중..."
                  : "로그인 중..."
                : isSignUp
                ? "회원가입"
                : "로그인"}
            </button>
            <button
              type="button"
              onClick={toggleMode}
              disabled={isLoading}
              className="w-full text-blue-600 text-sm hover:underline disabled:text-gray-400"
            >
              {isSignUp
                ? "이미 계정이 있으신가요? 로그인"
                : "계정이 없으신가요? 회원가입"}
            </button>
          </form>
        </div>
      </GradientContainer>
    </div>
  );
}
