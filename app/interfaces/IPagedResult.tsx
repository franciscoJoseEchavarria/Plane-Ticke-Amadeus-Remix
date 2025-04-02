using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace app.interfaces
{
    public interface IPagedResult
    {
    items: T[];
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    }
}
