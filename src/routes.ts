// src/routes/routes.ts
export interface Route {
  name?: string;
  path: string;
}

export const routes: Route[] = [
  {
    name: "Review",
    path: "/",
  },
  // {
  //   name: "Inverse",
  //   path: "/inverse",
  // },
  {
    name: "List",
    path: "/list",
  },
  {
    name: "Add",
    path: "/cardForm",
  },
  {
    path: "/cardForm/:id",
  },
  {
    name: "Groups",
    path: "/groups",
  },
  {
    name: "Direct",
    path: "/direct",
  },
];
