import { redirect, useLoaderData } from "react-router";
import { getAdminMetrics, getAdminUsers } from "~/lib/api";
import { requireStaffUser } from "~/lib/auth";

export async function clientLoader() {
  const { token } = await requireStaffUser();

  try {
    const [metrics, users] = await Promise.all([
      getAdminMetrics(token),
      getAdminUsers(token)
    ]);
    return { metrics, users };
  } catch {
    throw redirect("/login?reason=expired");
  }
}

export default function AdminDashboard() {
  const { metrics, users } = useLoaderData<typeof clientLoader>();

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2 text-black">Dashboard</h1>
      </div>

      {/* KPI Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title"><i className="bi bi-people me-2"></i>Total Users</h5>
              <h3 className="card-text">{metrics.totalUsers}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title"><i className="bi bi-chat-dots me-2"></i>Total Comments</h5>
              <h3 className="card-text">{metrics.totalComments}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-danger mb-3">
            <div className="card-body">
              <h5 className="card-title"><i className="bi bi-heart-fill me-2"></i>Total Likes</h5>
              <h3 className="card-text">{metrics.totalLikes}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Table */}
      <div className="card mt-4">
        <div className="card-header bg-white">
          <i className="bi bi-table me-1"></i> All Users
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Date Created</th>
                  <th>Engagements</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>#{user.id.substring(0,8)}</td>
                    <td>{user.username}</td>
                    <td>{new Date(user.dateCreated).toLocaleDateString()}</td>
                    <td>{user.totalEngagements}</td>
                    <td>
                      {user.isSuperuser ? (
                        <span className="badge bg-danger">Superuser</span>
                      ) : user.isStaff ? (
                        <span className="badge bg-primary">Admin</span>
                      ) : (
                        <span className="badge bg-success">User</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
