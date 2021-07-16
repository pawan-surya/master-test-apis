module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("users",
        {
            fullName: {
                type: Sequelize.STRING,
                defaultValue: '',
                allowNull: false,
                validate: {
                    notEmpty: true,
                }
            },
            email_verify: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            password: {
                type: Sequelize.STRING,
                defaultValue: "",
                allowNull: false
            },
            sign_in_count: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: {
                    args: true,
                    message: 'has already been taken.',
                    fields: [sequelize.fn('lower', sequelize.col('email'))]
                },
                validate: {
                    isEmail: true,
                    notEmpty: true,
                }
            },
            token: {
                type: Sequelize.STRING,
            },
            code: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                }
            },
            telephone: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {

                    notEmpty: true,
                },
                unique: {
                    args: true,
                    message: 'has already been taken.',
                    fields: [sequelize.fn('lower', sequelize.col('telephone'))]
                }
            }
        },
        {
            indexes: [
                {
                    unique: true,
                    fields: ["email"],
                    name: "index_users_on_email"
                },
            ]
        }, { timestamps: true });

    return Users;
};
