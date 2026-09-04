import { useState, useEffect, useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

function useContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const res = await fetch(`${API_URL}/contacts`);
      const data = await res.json();
      setContacts(data);
    } catch {
      /* server unreachable */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { contacts, loading, refresh };
}

function TrashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ContactRow({ contact, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(contact.id);
    setDeleting(false);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr auto",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem 1.25rem",
        borderBottom: "1px solid var(--color-border)",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "var(--color-surface-2)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "transparent")
      }
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          color: "var(--color-text)",
          fontSize: "0.9rem",
        }}
      >
        {contact.name}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.78rem",
          color: "var(--color-accent)",
          letterSpacing: "0.01em",
        }}
      >
        {contact.email}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.78rem",
          color: "var(--color-muted)",
          letterSpacing: "0.01em",
        }}
      >
        {contact.phone || "—"}
      </span>
      <button
        onClick={handleDelete}
        disabled={deleting}
        title="Delete contact"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "2rem",
          height: "2rem",
          borderRadius: "6px",
          border: "1px solid var(--color-border)",
          background: "transparent",
          color: "var(--color-muted)",
          cursor: deleting ? "not-allowed" : "pointer",
          opacity: deleting ? 0.4 : 1,
          transition: "color 0.15s, border-color 0.15s, background 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--color-danger)";
          e.currentTarget.style.borderColor = "var(--color-danger)";
          e.currentTarget.style.background = "rgba(224,80,80,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--color-muted)";
          e.currentTarget.style.borderColor = "var(--color-border)";
          e.currentTarget.style.background = "transparent";
        }}
      >
        <TrashIcon />
      </button>
    </div>
  );
}

function AddContactForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const nameRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message ?? "Something went wrong.");
        return;
      }
      setName("");
      setEmail("");
      setPhone("");
      onSuccess();
      nameRef.current?.focus();
    } catch {
      setError("Could not reach the server. Is it running?");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.65rem 0.85rem",
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "8px",
    color: "var(--color-text)",
    fontFamily: "var(--font-body)",
    fontSize: "0.875rem",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.4rem",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--color-muted)",
    fontFamily: "var(--font-body)",
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = "var(--color-accent)";
    e.target.style.boxShadow = "0 0 0 2px rgba(232,166,32,0.15)";
  };
  const handleBlur = (e) => {
    e.target.style.borderColor = "var(--color-border)";
    e.target.style.boxShadow = "none";
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div>
          <label style={labelStyle}>Name *</label>
          <input
            ref={nameRef}
            style={inputStyle}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Tafadzwa Mukura"
            autoComplete="off"
          />
        </div>
        <div>
          <label style={labelStyle}>Email *</label>
          <input
            style={inputStyle}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="tafadzwa@gmail.com"
            autoComplete="off"
          />
        </div>
        <div>
          <label style={labelStyle}>Phone</label>
          <input
            style={inputStyle}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="+263 77 123 4567"
            autoComplete="off"
          />
        </div>
      </div>

      {error && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.65rem 1rem",
            background: "rgba(224,80,80,0.08)",
            border: "1px solid rgba(224,80,80,0.3)",
            borderRadius: "8px",
            color: "var(--color-danger)",
            fontSize: "0.83rem",
            fontFamily: "var(--font-body)",
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.65rem 1.25rem",
          background: submitting ? "var(--color-accent-dim)" : "var(--color-accent)",
          color: "#0a0a0f",
          fontFamily: "var(--font-body)",
          fontSize: "0.85rem",
          fontWeight: 600,
          border: "none",
          borderRadius: "8px",
          cursor: submitting ? "not-allowed" : "pointer",
          letterSpacing: "0.02em",
          transition: "background 0.15s, transform 0.1s",
        }}
        onMouseEnter={(e) => {
          if (!submitting) e.currentTarget.style.background = "var(--color-accent-dim)";
        }}
        onMouseLeave={(e) => {
          if (!submitting) e.currentTarget.style.background = "var(--color-accent)";
        }}
      >
        <PlusIcon />
        {submitting ? "Adding…" : "Add Contact"}
      </button>
    </form>
  );
}

export default function App() {
  const { contacts, loading, refresh } = useContacts();

  return (
    <div
      style={{
        minHeight: "100%",
        background: "var(--color-bg)",
        padding: "0 1.5rem 4rem",
      }}
    >
      {/* Header */}
      <header
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "3rem 0 2.5rem",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              marginBottom: "0.5rem",
            }}
          >
            Directory
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              lineHeight: 1.05,
              color: "var(--color-text)",
              margin: 0,
            }}
          >
            myContacts
          </h1>
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            color: "var(--color-muted)",
            textAlign: "right",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "0.3rem 0.7rem",
              border: "1px solid var(--color-border)",
              borderRadius: "999px",
            }}
          >
            {contacts.length} {contacts.length === 1 ? "entry" : "entries"}
          </span>
        </div>
      </header>

      <main style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Add form */}
        <section
          style={{
            marginTop: "2.5rem",
            padding: "1.75rem",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "12px",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
              marginBottom: "1.25rem",
              marginTop: 0,
            }}
          >
            New Contact
          </h2>
          <AddContactForm onSuccess={refresh} />
        </section>

        {/* Contact list */}
        <section style={{ marginTop: "2.5rem" }}>
          {/* Column headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr auto",
              gap: "1rem",
              padding: "0.5rem 1.25rem",
              marginBottom: "0.25rem",
            }}
          >
            {["Name", "Email", "Phone", ""].map((h, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-muted)",
                }}
              >
                {h}
              </span>
            ))}
          </div>

          <div
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: "12px",
              overflow: "hidden",
              background: "var(--color-surface)",
            }}
          >
            {loading ? (
              <div
                style={{
                  padding: "3rem",
                  textAlign: "center",
                  color: "var(--color-muted)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.78rem",
                  letterSpacing: "0.06em",
                }}
              >
                Loading…
              </div>
            ) : contacts.length === 0 ? (
              <div
                style={{
                  padding: "3rem",
                  textAlign: "center",
                  color: "var(--color-muted)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontSize: "1.25rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  No contacts yet
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  Add one above to get started.
                </p>
              </div>
            ) : (
              contacts.map((c) => (
                <ContactRow
                  key={c.id}
                  contact={c}
                  onDelete={async (id) => {
                    await fetch(`${API_URL}/contacts/${id}`, {
                      method: "DELETE",
                    });
                    await refresh();
                  }}
                />
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
