export default function EditUserPage({ params }) {
    const { id } = params;
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Edit User #{id}</h1>
        <p>Here you can edit the user details. Connect your profile component here.</p>
      </div>
    );
  }
  