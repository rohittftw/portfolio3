import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./screens/Login";
import { SignUp } from "./screens/SignUp";
import { AdminDashboard, BlogManager, CreateBlog, EditBlog, AdminLayout, ProjectManager, CreateProject, EditProject } from "./screens/AdminDashboard";
import { Hero } from "./screens/Hero";
import { Blog } from "./screens/Blog";
import { BlogDetail } from "./screens/BlogDetail";
import { Projects } from "./screens/Projects";
import { Resume } from "./screens/Resume";
import { NotFound } from "./screens/NotFound";
import { ProtectedRoute } from "./components/ui/ProtectedRoutes";

export const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Hero />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/blogs" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/resume" element={<Resume />} />

        {/* Admin Auth Routes - Public */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/signup" element={<SignUp />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="blogs" element={<BlogManager />} />
          <Route path="blogs/new" element={<CreateBlog />} />
          <Route path="blogs/edit/:id" element={<EditBlog />} />
          <Route path="projects" element={<ProjectManager />} />
          <Route path="projects/new" element={<CreateProject />} />
          <Route path="projects/edit/:id" element={<EditProject />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
