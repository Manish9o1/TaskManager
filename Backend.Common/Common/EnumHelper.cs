using Backend.Common.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskStatus = Backend.Common.Entities.TaskStatus;

namespace Backend.Common.Common
{
    public class EnumHelper
    {
        public static (string Name, int Value) GetPriority(int value)
        {
            if (Enum.IsDefined(typeof(TaskPriority), value))
            {
                var enumValue = (TaskPriority)value;
                return (enumValue.ToString(), value);
            }

            throw new ArgumentException($"Invalid TaskPriority value: {value}");
        }
        public static (string Name, int Value) GetStatus(int value)
        {
            if (Enum.IsDefined(typeof(TaskStatus), value))
            {
                var enumValue = (TaskStatus)value;
                return (enumValue.ToString(), value);
            }

            throw new ArgumentException($"Invalid TaskPriority value: {value}");
        }
    }
}
