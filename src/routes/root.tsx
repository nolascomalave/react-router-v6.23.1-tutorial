import { useEffect, useState } from 'react';
import { Outlet, NavLink, useLoaderData, Form, redirect, useNavigation, useSubmit } from "react-router-dom";
import { getContacts, createContact } from "../contacts";

export async function action() {
    const contact = await createContact();
    return redirect(`/contacts/${contact.id}/edit`);
    // return { contact };
}

export async function loader({ request }: { request: any }) {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") || "";
    const contacts = await getContacts(q);
    return { contacts, q };
}

export default function Root() {
    const { contacts, q }: any = useLoaderData();
    const navigation = useNavigation();
    const submit = useSubmit();

    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has(
            "q"
        );

    useEffect(() => {
        (document.getElementById("q") as HTMLInputElement).value = q;
    }, [q]);

    return (
      <>
        <div id="sidebar">
          <h1>React Router Contacts</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                className={searching ? "loading" : ""}
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
                onChange={(event) => {
                    const isFirstSearch = q == null;
                    submit(event.currentTarget.form, {
                        replace: !isFirstSearch,
                    });
                }}
              />
              <div
                id="search-spinner"
                aria-hidden
                hidden={!searching}
              />
              <div
                className="sr-only"
                aria-live="polite"
              ></div>
            </Form>
            {/* <form method="post">
              <button type="submit">New</button>
            </form> */}
            <Form method="post">
                <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            <ul>
                {contacts.length ? (
                    <ul>
                        {contacts.map((contact: any) => (
                            <li key={contact.id}>
                                <NavLink
                                    to={`contacts/${contact.id}`}
                                    className={({ isActive, isPending }: { isActive: boolean, isPending: boolean }) =>
                                        isActive
                                            ? "active"
                                            : isPending
                                            ? "pending"
                                            : ""
                                    }
                                >
                                    {contact.first || contact.last ? (
                                        <>
                                            {contact.first} {contact.last}
                                        </>
                                    ) : (
                                        <i>No Name</i>
                                    )}{" "}
                                    {contact.favorite && <span>★</span>}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>
                        <i>No contacts</i>
                    </p>
                )}
              {/* <li>
                <NavLink to={`/contacts/1`}>Your Name</NavLink>
                {/* <a href={`/contacts/1`}>Your Name</a>
              </li>
              <li>
                <NavLink to={`/contacts/2`}>Your Friend</NavLink>
                {/* <a href={`/contacts/2`}>Your Friend</a>
              </li> */}
            </ul>
          </nav>
        </div>
        <div
            id="detail"
            className={
                navigation.state === "loading" ? "loading" : ""
            }
        >
            <Outlet />
        </div>
      </>
    );
  }