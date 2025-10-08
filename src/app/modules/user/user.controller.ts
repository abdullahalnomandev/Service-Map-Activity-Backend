import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getMultipleFilesPath, getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';


//create user
const createNewUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const {email, name , password , confirmPassword } = req.body;
     await UserService.createUserToDB({email, name , password, confirmPassword});

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User Created successfully. Please check your email to activate your account'
    });
  }
);

//update profile
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.id;
    let profileImage = getSingleFilePath(req.files, 'profileImage');

    const { name, preferences} = req.body;

    const data: any = {};

    if (profileImage) data.profileImage = profileImage;
    if (name != null) data.name = name;
    if (preferences != null) data.preferences = preferences;

     console.log(req.files)
    const result = await UserService.updateUserToDB(userId, data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User updated successfully',
      data: result,
    });
  }
);

// GET all users
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Users retrieved successfully',
    data: result,
  });
});

// GET profile users
const getProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getProfile(req.user?.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Users profile retrive successfully',
    data: result,
  });
});


export const UserController = {
  updateUser,
  createNewUser,
  getAllUsers,
  getProfile
};
