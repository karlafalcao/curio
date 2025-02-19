import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useCallback,
    useEffect,
} from "react";
import {
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    addEdge,
    useNodesState,
    useEdgesState,
    useReactFlow,
    getOutgoers,
    MarkerType,
} from "reactflow";
import { ConnectionValidator } from "../ConnectionValidator";
import {
    AccessLevelType,
    BoxType,
    EdgeType,
    VisInteractionType,
} from "../constants";
import { templates } from "./templates";
import { v4 as uuid } from "uuid";

export interface Template {
    id: string;
    type: BoxType;
    name: string;
    description: string;
    accessLevel: AccessLevelType;
    code: string; // grammar or python
    custom: boolean;
}

interface TemplateContextProps {
    getTemplates: (type: BoxType, custom: boolean) => Template[];
    createUserTemplate: (
        type: BoxType,
        name: string,
        description: string,
        accessLevel: AccessLevelType,
        code: string
    ) => Template | null;
    editUserTemplate: (template: Template) => void;
    deleteTemplate: (templateId: string) => void;
}

export const TemplateContext = createContext<TemplateContextProps>({
    getTemplates: () => [],
    createUserTemplate: () => null,
    editUserTemplate: () => {},
    deleteTemplate: () => {},
});

const TemplateProvider = ({ children }: { children: ReactNode }) => {
    const [defaultTemplates, setDefaultTemplates] =
        useState<Template[]>(templates);
    const [userTemplates, setUserTemplates] = useState<Template[]>([]);

    const createUserTemplate = (
        type: BoxType,
        name: string,
        description: string,
        accessLevel: AccessLevelType,
        code: string
    ) => {
        let template = {
            id: uuid(),
            type,
            name,
            description,
            accessLevel,
            code,
            custom: true,
        };

        let newTemplates: Template[] = [];

        for (const template of userTemplates) {
            newTemplates.push({ ...template });
        }

        newTemplates.push({ ...template });

        setUserTemplates(newTemplates);

        return { ...template };
    };

    const editUserTemplate = (templateNew: Template) => {
        let newTemplates: Template[] = [];

        for (const template of userTemplates) {
            if (template.id == templateNew.id)
                newTemplates.push({ ...templateNew });
            else newTemplates.push({ ...template });
        }

        setUserTemplates(newTemplates);
    };

    const getTemplates = (type: BoxType, custom: boolean) => {
        let returnedTemplates = [];
        let templates = [];

        if (custom) {
            templates = userTemplates;
        } else {
            templates = defaultTemplates;
        }

        for (const template of templates) {
            if (template.type == type) {
                returnedTemplates.push({ ...template });
            }
        }

        return returnedTemplates;
    };

    const deleteTemplate = (templateId: string) => {
        let newTemplates: Template[] = [];

        for (const template of userTemplates) {
            if (template.id != templateId) newTemplates.push({ ...template });
        }

        setUserTemplates(newTemplates);
    };

    return (
        <TemplateContext.Provider
            value={{
                getTemplates,
                createUserTemplate,
                editUserTemplate,
                deleteTemplate,
            }}
        >
            {children}
        </TemplateContext.Provider>
    );
};

export const useTemplateContext = () => {
    const context = useContext(TemplateContext);

    if (!context) {
        throw new Error(
            "useTemplateContext must be used within a TemplateProvider"
        );
    }

    return context;
};

export default TemplateProvider;
