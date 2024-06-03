import { Blueprint, Model, TRelation, TSchema } from '../../src/lib';
declare const userSchema: {
    id: Blueprint<number>;
    uuid: Blueprint<string | null>;
    email: Blueprint<string | null>;
    name: Blueprint<string | null>;
    username: Blueprint<string | null>;
    password: Blueprint<string | null>;
    createdAt: Blueprint<string | Date | null>;
    updatedAt: Blueprint<string | Date | null>;
    deletedAt: Blueprint<string | Date | null>;
};
type TUserSchema = TSchema<typeof userSchema>;
type TUserRelation = TRelation<{
    posts: Post[];
    post: Post;
}>;
export declare class User extends Model<TUserSchema, TUserRelation> {
    constructor();
}
export declare class Post extends Model {
    constructor();
}
export declare class PostUser extends Model {
    constructor();
}
export declare const userSchemaObject: {
    type: string;
    properties: {
        id: {
            type: string;
        };
        uuid: {
            anyOf: {
                type: string;
            }[];
        };
        email: {
            type: string;
        };
        name: {
            anyOf: {
                type: string;
            }[];
        };
        username: {
            anyOf: {
                type: string;
            }[];
        };
        password: {
            type: string;
        };
        createdAt: {
            anyOf: ({
                type: string;
                format?: undefined;
            } | {
                type: string;
                format: string;
            })[];
        };
        updatedAt: {
            anyOf: ({
                type: string;
                format?: undefined;
            } | {
                type: string;
                format: string;
            })[];
        };
        deletedAt: {
            anyOf: ({
                type: string;
                format?: undefined;
            } | {
                type: string;
                format: string;
            })[];
        };
    };
};
export declare const userSchemaArray: {
    type: string;
    items: {
        type: string;
        properties: {
            id: {
                type: string;
            };
            uuid: {
                anyOf: {
                    type: string;
                }[];
            };
            email: {
                type: string;
            };
            name: {
                anyOf: {
                    type: string;
                }[];
            };
            username: {
                anyOf: {
                    type: string;
                }[];
            };
            password: {
                type: string;
            };
            createdAt: {
                anyOf: ({
                    type: string;
                    format?: undefined;
                } | {
                    type: string;
                    format: string;
                })[];
            };
            updatedAt: {
                anyOf: ({
                    type: string;
                    format?: undefined;
                } | {
                    type: string;
                    format: string;
                })[];
            };
            deletedAt: {
                anyOf: ({
                    type: string;
                    format?: undefined;
                } | {
                    type: string;
                    format: string;
                })[];
            };
        };
    };
};
export declare const postSchemaObject: {
    type: string;
    properties: {
        id: {
            type: string;
        };
        uuid: {
            anyOf: {
                type: string;
            }[];
        };
        userId: {
            type: string;
        };
        title: {
            type: string;
        };
        subtitle: {
            anyOf: {
                type: string;
            }[];
        };
        description: {
            anyOf: {
                type: string;
            }[];
        };
        createdAt: {
            anyOf: ({
                type: string;
                format?: undefined;
            } | {
                type: string;
                format: string;
            })[];
        };
        updatedAt: {
            anyOf: ({
                type: string;
                format?: undefined;
            } | {
                type: string;
                format: string;
            })[];
        };
        deletedAt: {
            anyOf: ({
                type: string;
                format?: undefined;
            } | {
                type: string;
                format: string;
            })[];
        };
    };
};
export declare const postSchemaArray: {
    type: string;
    items: {
        type: string;
        properties: {
            id: {
                type: string;
            };
            uuid: {
                anyOf: {
                    type: string;
                }[];
            };
            userId: {
                type: string;
            };
            title: {
                type: string;
            };
            subtitle: {
                anyOf: {
                    type: string;
                }[];
            };
            description: {
                anyOf: {
                    type: string;
                }[];
            };
            createdAt: {
                anyOf: ({
                    type: string;
                    format?: undefined;
                } | {
                    type: string;
                    format: string;
                })[];
            };
            updatedAt: {
                anyOf: ({
                    type: string;
                    format?: undefined;
                } | {
                    type: string;
                    format: string;
                })[];
            };
            deletedAt: {
                anyOf: ({
                    type: string;
                    format?: undefined;
                } | {
                    type: string;
                    format: string;
                })[];
            };
        };
    };
};
export {};
