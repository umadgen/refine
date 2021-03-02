import React from "react";
import { useHistory } from "react-router-dom";
import { Card, Button, Form, Space } from "antd";
import pluralize from "pluralize";
import { SaveOutlined } from "@ant-design/icons";

import { useCreate } from "@hooks";
import { BaseRecord } from "@interfaces";

export interface CreateProps {
    resourceName: string;
    canEdit?: boolean;
    title?: string;
    actionButtons?: React.FC;
}

export const Create: React.FC<CreateProps> = ({
    resourceName,
    canEdit,
    title,
    actionButtons,
    children,
}) => {
    const history = useHistory();
    const [form] = Form.useForm();

    const { mutate, isLoading } = useCreate(resourceName);

    const onFinish = async (values: BaseRecord): Promise<void> => {
        mutate(
            { values },
            {
                onSuccess: (data) => {
                    if (canEdit) {
                        return history.push(
                            `/resources/${resourceName}/edit/${data.data.id}`,
                        );
                    }

                    return history.push(`/resources/${resourceName}`);
                },
            },
        );
    };

    const childrenWithProps = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                resourceName,
                onFinish,
                form,
            });
        }
        return child;
    });

    return (
        <Card
            title={title ?? `Create ${pluralize.singular(resourceName)}`}
            actions={[
                <Space
                    key="action-buttons"
                    style={{ float: "right", marginRight: 24 }}
                >
                    {actionButtons ?? (
                        <Button
                            htmlType="submit"
                            disabled={isLoading}
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={(): void => form.submit()}
                        >
                            Save
                        </Button>
                    )}
                </Space>,
            ]}
        >
            {childrenWithProps}
        </Card>
    );
};
