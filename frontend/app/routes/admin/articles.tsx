import { redirect, useLoaderData, useNavigate } from "react-router";
import { Link } from "react-router";
import { getAdminArticles, updateArticleStatus, deleteAdminArticle } from "~/lib/api";
import { requireStaffUser } from "~/lib/auth";
import type { ArticleStatus } from "~/types/admin";

export async function clientLoader({ request }: { request: Request }) {
  const { token } = await requireStaffUser();
  
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "0", 10);
  const size = parseInt(url.searchParams.get("size") || "10", 10);
  const sort = url.searchParams.get("sort") || "createdAt,desc";
  
  try {
    const articlesPage = await getAdminArticles(token, page, size, sort);
    return { articlesPage, token, page, size, sort };
  } catch {
    throw redirect("/login?reason=expired");
  }
}

export default function AdminArticles() {
  const { articlesPage, token, page, sort } = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();

  const handleStatusChange = async (id: number, currentStatus: ArticleStatus) => {
    let nextStatus: ArticleStatus = 'PUBLISHED';
    if (currentStatus === 'DRAFT') nextStatus = 'PUBLISHED';
    else if (currentStatus === 'PUBLISHED') nextStatus = 'ARCHIVED';
    else if (currentStatus === 'ARCHIVED') nextStatus = 'DRAFT';
    
    if (confirm(`Change article #${id} status from ${currentStatus} to ${nextStatus}?`)) {
      try {
        await updateArticleStatus(id, nextStatus, token);
        navigate(`?page=${page}&sort=${sort}`, { replace: true });
      } catch (err) {
        alert("Failed to update status.");
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(`Are you sure you want to permanently DELETE article #${id}?`)) {
      try {
        await deleteAdminArticle(id, token);
        navigate(`?page=${page}&sort=${sort}`, { replace: true });
      } catch (err) {
        alert("Failed to delete article.");
      }
    }
  };

  const handleSort = (column: string) => {
    const isAsc = sort === `${column},asc`;
    const newSort = `${column},${isAsc ? 'desc' : 'asc'}`;
    navigate(`?page=${page}&sort=${newSort}`);
  };

  const getSortIcon = (column: string) => {
    if (sort === `${column},asc`) return <i className="bi bi-caret-up-fill ms-1 fs-6"></i>;
    if (sort === `${column},desc`) return <i className="bi bi-caret-down-fill ms-1 fs-6"></i>;
    return <i className="bi bi-caret-up ms-1 text-muted opacity-50 fs-6"></i>;
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2 text-black">Articles Management</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Link to="/editor" className="btn btn-sm btn-success">
            <i className="bi bi-plus-circle me-1"></i> New Article
          </Link>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header bg-white">
          <i className="bi bi-pencil-square me-1"></i> All Articles
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('id')}>ID {getSortIcon('id')}</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('title')}>Title {getSortIcon('title')}</th>
                  <th>Author</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('createdAt')}>Date Created {getSortIcon('createdAt')}</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('status')}>Status {getSortIcon('status')}</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articlesPage.content.map((article) => (
                  <tr key={article.id}>
                    <td>#{article.id}</td>
                    <td>{article.title}</td>
                    <td>{article.authorName}</td>
                    <td>{new Date(article.dateCreated).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${
                        article.status === 'PUBLISHED' ? 'bg-success' :
                        article.status === 'DRAFT' ? 'bg-warning text-dark' :
                        article.status === 'ARCHIVED' ? 'bg-secondary' : 'bg-danger'
                      }`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <Link to={`/articles/${article.id}`} className="btn btn-outline-primary" title="View Public">
                          <i className="bi bi-eye"></i>
                        </Link>
                        <Link to={`/editor?edit=${article.id}`} className="btn btn-outline-secondary" title="Edit Content">
                          <i className="bi bi-pencil"></i>
                        </Link>
                        <button 
                          className="btn btn-outline-warning" 
                          title="Cycle Status (Draft -> Publ -> Arch -> Draft)" 
                          onClick={() => handleStatusChange(article.id, article.status)}
                          disabled={article.status === 'DELETED'}
                        >
                          <i className="bi bi-arrow-repeat"></i>
                        </button>
                        <button 
                          className="btn btn-outline-danger" 
                          title="Delete Article"
                          onClick={() => handleDelete(article.id)}
                          disabled={article.status === 'DELETED'}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {articlesPage.content.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">
                      No articles found in the system.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {articlesPage.totalPages > 1 && (
            <nav aria-label="Article page navigation" className="mt-3">
              <ul className="pagination justify-content-center mb-0">
                <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                  <Link className="page-link" to={`?page=${page - 1}&sort=${sort}`}>Previous</Link>
                </li>
                {[...Array(articlesPage.totalPages)].map((_, i) => (
                  <li key={i} className={`page-item ${page === i ? 'active' : ''}`}>
                    <Link className="page-link" to={`?page=${i}&sort=${sort}`}>{i + 1}</Link>
                  </li>
                ))}
                <li className={`page-item ${page >= articlesPage.totalPages - 1 ? 'disabled' : ''}`}>
                  <Link className="page-link" to={`?page=${page + 1}&sort=${sort}`}>Next</Link>
                </li>
              </ul>
            </nav>
          )}

        </div>
      </div>
    </>
  );
}
