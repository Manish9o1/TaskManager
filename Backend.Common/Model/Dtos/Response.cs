using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Common.Model.Dtos
{
    public class Response
    {
        public bool IsSuccess { get; set; }
        public object? Result { get; set; } = null!;
        public string Message { get; set; } = null!;
        public List<string> Errors { get; set; } = [];
    }
}
