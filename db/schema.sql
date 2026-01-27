CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT get_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);


CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TYPE workspace_role AS ENUM ('owner','member');

CREATE TABLE workspace_members (
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    role workspace_role NOT NULL,

    joined_at TIMESTAMP NOT NULL DEFAULT now(),

    PRIMARY KEY (workspace_id, user_id)
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,

    name TEXT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT now()
);


CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done');

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,

    title TEXT NOT NULL,

    status task_status NOT NULL DEFAULT 'todo',

    assignee_id UUID,

    created_at TIMESTAMP NOT NULL DEFAULT now(),

    CONSTRAINT fk_task_assignee_membership
        FOREIGN KEY (workspace_id, assignee_id)
        REFERENCES workspace_members(workspace_id, user_id)
);

ALTER TABLE projects
ADD CONSTRAINT unique_project_workspace
UNIQUE (id, workspace_id);

ALTER TABLE tasks
ADD CONSTRAINT fk_task_project_workspace
FOREIGN KEY (project_id, workspace_id)
REFERENCES projects(id, workspace_id);

CREATE UNIQUE INDEX one_owner_per_workspace
ON workspace_members(workspace_id)
WHERE role = 'owner';


CREATE INDEX idx_workspace_members_user
ON workspace_members(user_id);

CREATE INDEX idx_projects_workspace
ON projects(workspace_id);

CREATE INDEX idx_tasks_project
ON tasks(project_id);

CREATE INDEX idx_tasks_assignee
ON tasks(assignee_id);
