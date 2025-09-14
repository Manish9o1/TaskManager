using Backend.Common.Model.Dtos;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Common.Common
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseApiController : ControllerBase
    {
        [NonAction]
        public ActionResult ReturnOk(object? result = null, string message = "Success")
        {
            var response = new Response
            {
                IsSuccess = true,
                Result = result,
                Message = message,
                Errors = new List<string>()
            };
            return Ok(response);
        }
        [NonAction]
        public ActionResult ReturnBadRequest(List<string> errors, string message = "Bad Request")
        {
            var response = new Response
            {
                IsSuccess = false,
                Result = null!,
                Message = message,
                Errors = errors
            };
            return BadRequest(response);
        }
        [NonAction]
        public ActionResult ReturnNotFound(string message = "Not Found")
        {
            var response = new Response
            {
                IsSuccess = false,
                Result = null!,
                Message = message,
                Errors = new List<string>()
            };
            return NotFound(response);
        }

    }
}
