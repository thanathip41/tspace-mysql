import { Model } from '../../src/lib';
export declare class User extends Model {
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
            anyOf: {
                type: string;
            }[];
        };
        updatedAt: {
            anyOf: {
                type: string;
            }[];
        };
        deletedAt: {
            anyOf: {
                type: string;
            }[];
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
                anyOf: {
                    type: string;
                }[];
            };
            updatedAt: {
                anyOf: {
                    type: string;
                }[];
            };
            deletedAt: {
                anyOf: {
                    type: string;
                }[];
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
            anyOf: {
                type: string;
            }[];
        };
        updatedAt: {
            anyOf: {
                type: string;
            }[];
        };
        deletedAt: {
            anyOf: {
                type: string;
            }[];
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
                anyOf: {
                    type: string;
                }[];
            };
            updatedAt: {
                anyOf: {
                    type: string;
                }[];
            };
            deletedAt: {
                anyOf: {
                    type: string;
                }[];
            };
        };
    };
};
