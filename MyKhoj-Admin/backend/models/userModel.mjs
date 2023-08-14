import { mykhojDB, mktemDB } from "../config/databaseConfig.mjs";
import { Sequelize, DataTypes, Op, Model } from "sequelize";
import bcrypt from "bcrypt";
const saltRounds = 10;

class MykhojUserMst extends Model {
  static associate(models) {
    MykhojUserMst.belongsTo(models.MykhojDepartmentMst, {
      foreignKey: "DepartmentID",
      as: "department",
    });

    MykhojUserMst.belongsTo(models.MykhojDesignationMst, {
      foreignKey: "DesignationID",
      as: "designation",
    });
  }
}

MykhojUserMst.init(
  {
    UserID: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    UserName: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    Password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    DepartmentID: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: -1,
      references: {
        model: "MykhojDepartmentMst",
        key: "DepartmentID",
      },
    },
    DesignationID: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: -1,
      references: {
        model: "MykhojDesignationMst",
        key: "DesignationID",
      },
    },
    Roll: {
      type: DataTypes.STRING(25),
    },
    FName: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    LName: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    Gender: {
      type: DataTypes.ENUM("Male", "Female"),
      defaultValue: "Male",
    },
    Email: {
      type: DataTypes.STRING(50),
    },
    MobileNumber: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    Address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    CityID: {
      type: DataTypes.MEDIUMINT,
      allowNull: false,
      defaultValue: -1,
      references: {
        model: "MykhojCityMst",
        key: "CityID",
      },
    },
    Status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    CreatedBy: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "MykhojUserMst",
        key: "UserID",
      },
    },
    ModifiedBy: {
      type: DataTypes.BIGINT,
      references: {
        model: "MykhojUserMst",
        key: "UserID",
      },
    },
    ModifiedOn: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: mykhojDB,
    modelName: "MykhojUserMst",
    tableName: "Adm_UserMst",
    underscored: false,
    timestamps: false,
  }
);

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
}

class UserMst {

  // static async userAuth(credentials, password) {
  //   try {
  //     const userData = await MykhojUserMst.findOne({
  //       where: {
  //         [Op.or]: [
  //           { UserID: credentials },
  //           { UserName: credentials },
  //           { MobileNumber: credentials },
  //         ],
  //       },
  //       attributes: [
  //         "UserID",
  //         "UserName",
  //         "Password",
  //         "DepartmentID",
  //         "DesignationID",
  //         "Roll",
  //         "Status",
  //       ],
  //     });
  //     if (!userData) {
  //       return { error: "Invalid UserName or Password" };
  //     } else if (userData.Status === false) {
  //       return { error: "Account Is Suspended, Please Contact Administrator" };
  //     } else {
  //       const isMatch = await bcrypt.compare(password, userData.Password);
  //       if (!isMatch) {
  //         return { error: "Invalid UserName or Password" };
  //       } else {
  //         return {
  //           success: {
  //             UserID: userData.UserID,
  //             UserName: userData.UserName,
  //             DepartmentID: userData.DepartmentID,
  //             DesignationID: userData.DesignationID,
  //           },
  //         };
  //       }
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     throw err;
  //   }
  // }
  static async userAuth(credentials, password) {
    try {
      const userData = await MykhojUserMst.findAll({
        where: {
          [Op.or]: [
            { UserID: credentials },
            { UserName: credentials },
            { MobileNumber: credentials },
          ],
        },
        attributes: ["UserID", "UserName", "Password", "DepartmentID", "DesignationID", "Roll", "Status"],
      });

      if (userData.length > 1) {
        return { error: "Please Contact The Administrator." };
      }
      if (userData.length === 0) {
        return { error: "Invalid UserName or Password." };
      }
      const singleUserData = userData[0];
      const { UserID, UserName, DepartmentID, DesignationID, Status, Password } = singleUserData;
      if (Status === false) {
        return { error: "Account Is Suspended. Please Contact The Administrator." };
      }
      const isMatch = await bcrypt.compare(password, Password);
      if (!isMatch) {
        return { error: "Invalid UserName or Password" };
      }
      return {
        success: {
          UserID: UserID,
          UserName: UserName,
          DepartmentID: DepartmentID,
          DesignationID: DesignationID,
        },
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async getUserByCredentials(credentials) {
    try {
      const userData = await MykhojUserMst.findAll({
        where: {
          [Op.or]: [
            { UserID: credentials },
            { UserName: credentials },
            { MobileNumber: credentials },
          ],
        },
        attributes: ["UserID", "Status"],
      });
      console.log(userData.length);
      if (userData.length > 1) {
        return { error: "Please Contact The Administrator." };
      }
      if (userData.length === 0) {
        return { error: "Invalid UserName." };
      }

      const singleUserData = userData[0];
      const { UserID, Status } = singleUserData;
      if (Status === false) {
        return { error: "Account Is Suspended. Please Contact The Administrator." };
      }
      return { success: UserID };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to retrieve user");
    }
  }

  static async updatePassword(credentials, password) {
    console.log(credentials, password);
    try {
      const hashedPassword = await hashPassword(password);
      const updatedCount = await MykhojUserMst.update(
        { Password: hashedPassword },
        { where: { UserID: credentials } }
      );
      if (updatedCount > 0) {
        return { success: "Password Updated" };
      } else {
        return { error: "No Matching UserID Found" };
      }
    } catch (error) {
      throw new Error("Failed to update password");
    }
  }

  static async userAdd(data) {
    try {
      const hashedPassword = await hashPassword(data.Password);
      data.Password = hashedPassword;

      const insertData = await MykhojUserMst.create(data);
      if (insertData) {
        return { success: "User Created Successfully" };
      } else {
        throw new Error("User not created");
      }
    } catch (error) {
      console.log(error);
      // throw new Error("Failed to create user" + error);
    }
  }

  // static async userDelete(userid) {
  //   try {

  //     const deletedUser = await MykhojUserMst.destroy({
  //       where: { UserID: userid }
  //     });

  //     console.log(deletedUser);

  //     if (deletedUser) {
  //       return { success: "User deleted successfully" };
  //     } else {
  //       return { error: "User not found" };
  //     }

  //   } catch (error) {
  //     throw new Error('Failed to delete user');
  //   }
  // }

  static async userUpdate(data, userid) {
    try {

      const updatedUser = await MykhojUserMst.update(data, {
        where: { UserID: userid }
      });
      // console.log(updatedUser);

      if (updatedUser.length > 0) {
        return { success: "User Updated" };
      } else {
        return { error: "Unknow Error" };
      }

    } catch (error) {
      throw new Error('Failed to update user');
    }
  }

  static async isUnique(username) {
    // console.log(username);
    try {
      const user = await MykhojUserMst.findOne({
        where: {
          UserName: username,
        },
        attributes: ["UserName"]
      });
      if (user) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error("Error occurred while checking username:", error);
    }
  }

}
export { UserMst, MykhojUserMst };
