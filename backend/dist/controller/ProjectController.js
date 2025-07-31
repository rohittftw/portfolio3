"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProject = CreateProject;
exports.GetAllProjects = GetAllProjects;
exports.GetFeaturedProjects = GetFeaturedProjects;
exports.GetProjectsByStatus = GetProjectsByStatus;
exports.GetProjectById = GetProjectById;
exports.GetProjectBySlug = GetProjectBySlug;
exports.UpdateProject = UpdateProject;
exports.DeleteProject = DeleteProject;
exports.GetProjectTechnologies = GetProjectTechnologies;
exports.ReorderProjects = ReorderProjects;
const prisma_1 = require("./prisma");
const client_1 = require("@prisma/client");
// Create a new project
async function CreateProject(req, res) {
    const { title, slug, description, short_description, featured_image, gallery_images = [], technologies = [], github_url, live_url, status = client_1.ProjectStatus.COMPLETED, featured = false, order_index } = req.body;
    try {
        // Check if slug already exists
        const existingProject = await prisma_1.prisma.project.findUnique({
            where: { slug }
        });
        if (existingProject) {
            return res.status(400).json({ msg: "Project with this slug already exists" });
        }
        const newProject = await prisma_1.prisma.project.create({
            data: {
                title,
                slug,
                description,
                short_description,
                featured_image,
                gallery_images,
                technologies,
                github_url,
                live_url,
                status,
                featured,
                order_index
            }
        });
        return res.status(201).json({
            msg: "Project created successfully",
            project: newProject
        });
    }
    catch (error) {
        console.error("Error creating project:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}
// Get all projects with pagination and filtering
async function GetAllProjects(req, res) {
    const { page = "1", limit = "10", status, technology, featured, search } = req.query;
    try {
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        // Build where clause
        const where = {};
        if (status) {
            where.status = status;
        }
        if (technology) {
            where.technologies = {
                has: technology
            };
        }
        if (featured !== undefined) {
            where.featured = featured === "true";
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { short_description: { contains: search, mode: "insensitive" } }
            ];
        }
        const [projects, totalCount] = await Promise.all([
            prisma_1.prisma.project.findMany({
                where,
                orderBy: [
                    { order_index: "asc" },
                    { createdAt: "desc" }
                ],
                skip,
                take: limitNum
            }),
            prisma_1.prisma.project.count({ where })
        ]);
        const totalPages = Math.ceil(totalCount / limitNum);
        return res.status(200).json({
            projects,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalCount,
                hasNext: pageNum < totalPages,
                hasPrev: pageNum > 1
            }
        });
    }
    catch (error) {
        console.error("Error fetching projects:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}
// Get featured projects (for public API)
async function GetFeaturedProjects(req, res) {
    const { limit = "6" } = req.query;
    try {
        const limitNum = parseInt(limit);
        const projects = await prisma_1.prisma.project.findMany({
            where: {
                featured: true,
                status: { not: client_1.ProjectStatus.ARCHIVED }
            },
            orderBy: [
                { order_index: "asc" },
                { createdAt: "desc" }
            ],
            take: limitNum,
            select: {
                project_id: true,
                title: true,
                slug: true,
                short_description: true,
                featured_image: true,
                technologies: true,
                github_url: true,
                live_url: true,
                status: true,
                createdAt: true
            }
        });
        return res.status(200).json({ projects });
    }
    catch (error) {
        console.error("Error fetching featured projects:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}
// Get projects by status (for public API)
async function GetProjectsByStatus(req, res) {
    const { status } = req.params;
    const { page = "1", limit = "10" } = req.query;
    try {
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        // Validate status
        if (!Object.values(client_1.ProjectStatus).includes(status)) {
            return res.status(400).json({ msg: "Invalid project status" });
        }
        const [projects, totalCount] = await Promise.all([
            prisma_1.prisma.project.findMany({
                where: { status },
                orderBy: [
                    { order_index: "asc" },
                    { createdAt: "desc" }
                ],
                skip,
                take: limitNum,
                select: {
                    project_id: true,
                    title: true,
                    slug: true,
                    short_description: true,
                    featured_image: true,
                    technologies: true,
                    github_url: true,
                    live_url: true,
                    status: true,
                    featured: true,
                    createdAt: true
                }
            }),
            prisma_1.prisma.project.count({ where: { status } })
        ]);
        const totalPages = Math.ceil(totalCount / limitNum);
        return res.status(200).json({
            projects,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalCount,
                hasNext: pageNum < totalPages,
                hasPrev: pageNum > 1
            }
        });
    }
    catch (error) {
        console.error("Error fetching projects by status:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}
// Get single project by ID
async function GetProjectById(req, res) {
    const { project_id } = req.params;
    try {
        const projectId = parseInt(project_id);
        if (isNaN(projectId)) {
            return res.status(400).json({ msg: "Invalid project ID" });
        }
        const project = await prisma_1.prisma.project.findUnique({
            where: { project_id: projectId }
        });
        if (!project) {
            return res.status(404).json({ msg: "Project not found" });
        }
        return res.status(200).json({ project });
    }
    catch (error) {
        console.error("Error fetching project:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}
// Get single project by slug (for public API)
async function GetProjectBySlug(req, res) {
    const { slug } = req.params;
    try {
        const project = await prisma_1.prisma.project.findUnique({
            where: { slug }
        });
        if (!project) {
            return res.status(404).json({ msg: "Project not found" });
        }
        // Don't return archived projects for public API
        if (project.status === client_1.ProjectStatus.ARCHIVED) {
            return res.status(404).json({ msg: "Project not found" });
        }
        return res.status(200).json({ project });
    }
    catch (error) {
        console.error("Error fetching project by slug:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}
// Update project
async function UpdateProject(req, res) {
    const { project_id } = req.params;
    const updateData = req.body;
    try {
        const projectId = parseInt(project_id);
        if (isNaN(projectId)) {
            return res.status(400).json({ msg: "Invalid project ID" });
        }
        // Check if project exists
        const existingProject = await prisma_1.prisma.project.findUnique({
            where: { project_id: projectId }
        });
        if (!existingProject) {
            return res.status(404).json({ msg: "Project not found" });
        }
        // Check if slug is being updated and if it already exists
        if (updateData.slug && updateData.slug !== existingProject.slug) {
            const slugExists = await prisma_1.prisma.project.findUnique({
                where: { slug: updateData.slug }
            });
            if (slugExists) {
                return res.status(400).json({ msg: "Project with this slug already exists" });
            }
        }
        const updatedProject = await prisma_1.prisma.project.update({
            where: { project_id: projectId },
            data: updateData
        });
        return res.status(200).json({
            msg: "Project updated successfully",
            project: updatedProject
        });
    }
    catch (error) {
        console.error("Error updating project:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}
// Delete project
async function DeleteProject(req, res) {
    const { project_id } = req.params;
    try {
        const projectId = parseInt(project_id);
        if (isNaN(projectId)) {
            return res.status(400).json({ msg: "Invalid project ID" });
        }
        const existingProject = await prisma_1.prisma.project.findUnique({
            where: { project_id: projectId }
        });
        if (!existingProject) {
            return res.status(404).json({ msg: "Project not found" });
        }
        await prisma_1.prisma.project.delete({
            where: { project_id: projectId }
        });
        return res.status(200).json({ msg: "Project deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting project:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}
// Get all unique technologies
async function GetProjectTechnologies(req, res) {
    try {
        const projects = await prisma_1.prisma.project.findMany({
            where: { status: { not: client_1.ProjectStatus.ARCHIVED } },
            select: { technologies: true }
        });
        const allTechnologies = projects.flatMap(project => project.technologies);
        const uniqueTechnologies = [...new Set(allTechnologies)];
        return res.status(200).json({ technologies: uniqueTechnologies });
    }
    catch (error) {
        console.error("Error fetching technologies:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}
// Reorder projects
async function ReorderProjects(req, res) {
    const { projectOrders } = req.body;
    try {
        // Validate input
        if (!Array.isArray(projectOrders) || projectOrders.length === 0) {
            return res.status(400).json({ msg: "Invalid project orders data" });
        }
        // Update all projects in a transaction
        const updatePromises = projectOrders.map(({ project_id, order_index }) => prisma_1.prisma.project.update({
            where: { project_id },
            data: { order_index }
        }));
        await Promise.all(updatePromises);
        return res.status(200).json({ msg: "Projects reordered successfully" });
    }
    catch (error) {
        console.error("Error reordering projects:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}
