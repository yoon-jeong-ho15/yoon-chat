import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();
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
        navigate("/profile");
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Hello Friends
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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
            <div className="text-green-500 text-sm text-center">{success}</div>
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
    </div>
  );
}
