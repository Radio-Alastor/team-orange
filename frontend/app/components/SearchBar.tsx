import { Form, useSearchParams, useSubmit } from "react-router";
import { useEffect, useState } from "react";

export default function SearchBar() {
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    if (!formData.get("q")) {
      formData.delete("q");
    }
    submit(formData, { action: "/articles", method: "get" });
  };

  return (
    <div className="search-bar-container mb-5">
      <Form onSubmit={handleSubmit} className="position-relative">
        <label htmlFor="search-input" className="visually-hidden">Search articles</label>
        <div className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden">
          <span className="input-group-text bg-white border-end-0 px-4 text-muted">
            <i className="bi bi-search"></i>
          </span>
          <input
            id="search-input"
            type="search"
            name="q"
            className="form-control border-start-0 ps-0 pe-4 py-3"
            placeholder="Search for 'Password', 'Scam', 'Email'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary px-4 fw-bold">Search</button>
        </div>
      </Form>
    </div>
  );
}
