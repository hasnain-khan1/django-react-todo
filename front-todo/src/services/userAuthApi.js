import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const userAuthApi = createApi({
  reducerPath: 'userAuthApi',
  // baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  baseQuery:fetchBaseQuery({baseUrl:'https://hasnain-django-api-dot-cloud-work-314310.ew.r.appspot.com'}),
  // baseQuery:fetchBaseQuery({baseUrl:'http://127.0.0.1:8000'}),

  endpoints: (builder) => ({
    registerUser:builder.mutation({
      query:(user)=>{
        return {
          url:'/register/',
          method:'POST',
          body:user,
          headers:{"Content-type":"application/json"}
        }
      }
    }),

  // 2nd api fetch
  loginUser:builder.mutation({
    query:(user)=>{
        return {
          url:"/token/",
          method:"POST",
          body:user,
          headers:{'Content-type':"application/json"}
        }
    }
  }),

  getLoggedUser: builder.query({
    query: (access_token) => {
      return {
        url: 'profile/',
        method: 'GET',
        headers: {
          'authorization': `Bearer ${access_token}`,
        }
      }
    }
  }),

  getAllTodos:builder.query({
      query:()=>{
        return{
          url:'/all-todo/',
          method:"GET",
          // headers:{'authorization':`Bearer ${access_token}`}
        }
      }
  }),
  addTodo:builder.mutation({
    query:(access_token,data)=>{
      return{
        url:'/add-todo',
        method:'POST',
        body:data,
        headers:{"authorization":`Bearer ${access_token}`}
      }
    }
  }),

  deleteTodo:builder.query({
    query:({access_token,id})=>{
      return{
        url:`/delete-todo/${id}/`,
        method:'DELETE',
        headers:{'authorization': `Bearer ${access_token}`}
      }
    }
  }),


  // end of apis
  }),
})

export const
 {useRegisterUserMutation
  ,useLoginUserMutation,useAddTodoMutation,useDeleteTodoQuery,useGetAllTodosQuery,
  useGetLoggedUserQuery} = userAuthApi