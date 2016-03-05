using NSP.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace NSP.Dal
{
    public static class EFContextHelper
    {
        const string CONTEXT_KEY = "EFContext";
        const string CONTEXT_TRAN_KEY = "EFContextTran";
        const string CONTEXT_TRAN_COUNT_KEY = "EFContextTranCount";

        private static T CreateDataContainer<T>(bool useTran, System.Data.IsolationLevel level) where T : EAMEntities, new()//,IDisposable, new()
        {
            string keyC = CONTEXT_KEY;// +"_" + typeof(T).Name;
            string keyT = CONTEXT_TRAN_KEY;// +"_" + typeof(T).Name;
            string keyTCount = CONTEXT_TRAN_COUNT_KEY;// +"_" + typeof(T).Name;
            T EFContext = ContextStorage.GetData<T>(keyC);
            if (EFContext == null)
            {
                EFContext = new T();
                //if (EFContext.Database.Connection.State != ConnectionState.Open)
                //{
                //    EFContext.Database.Connection.Open();

                //    EFContext.Database.Connection.Disposed += new EventHandler(Connection_Disposed);
                //}
                EFContext.Database.Connection.Disposed += new EventHandler(Connection_Disposed);
                ContextStorage.SetData<T>(keyC, EFContext);
            }
            else
            {
                //EFContext.refCount++;
            }
            if (useTran)
            {
                DbContextTransaction tran = ContextStorage.GetData<DbContextTransaction>(keyT);
                if (tran == null)
                {
                    if (level < 0)
                        tran = EFContext.Database.BeginTransaction();
                    else
                        tran = EFContext.Database.BeginTransaction(level);
                    ContextStorage.SetData<DbContextTransaction>(keyT, tran);
                    ContextStorage.SetData<int>(keyTCount, 0);
                }
                else
                {
                    int c = ContextStorage.GetData<int>(keyTCount) + 1;
                    ContextStorage.SetData<int>(keyTCount, c);
                }
            }
            return EFContext;
        }

        static void Connection_Disposed(object sender, EventArgs e)
        {
            ContextStorage.ClearData(CONTEXT_KEY);
            ContextStorage.ClearData(CONTEXT_TRAN_COUNT_KEY);
            ContextStorage.ClearData(CONTEXT_TRAN_KEY);
        }

        #region 仅为单一数据上下文容器DataContainer而设计
        /// <summary>
        /// 强行开启新容器
        /// </summary>
        /// <returns></returns>
        public static EAMEntities CreateNewEFContext()
        {
            EAMEntities pc = new EAMEntities();
            return pc;
        }
        /// <summary>
        /// 创建一个数据容器
        /// 容器是上下文一致的
        /// </summary>
        /// <returns></returns>
        public static EAMEntities CreateEFContext()
        {
            return CreateEFContext(false);
        }
        public static EAMEntities ContextUsage
        {
            get { return CreateEFContext(); }
        }
        /// <summary>
        /// 创建一个使用默认事务的数据容器
        /// 容器是上下文一致的
        /// </summary>
        /// <returns></returns>
        public static EAMEntities CreateEFContext(bool userDefaultIsolationLevel)
        {
            return CreateDataContainer<EAMEntities>(userDefaultIsolationLevel, ((IsolationLevel)(-1)));
        }
        /// <summary>
        /// 在上下文容器上
        /// 开始一个特定隔离级别的事务
        /// </summary>
        /// <param name="level"></param>
        public static void BeginContextTrasaction(System.Data.IsolationLevel level = IsolationLevel.ReadCommitted)
        {
            DbContext dc = ContextStorage.GetData<DbContext>(CONTEXT_KEY);
            if (dc == null)
            {
                throw new DataException("开始事务之前，必需先创建数据上下文容器");
            }
            //if (dc.Database.Connection.State != ConnectionState.Open)
            //{
            //    dc.Database.Connection.Open();
            //}
            DbContextTransaction tran = ContextStorage.GetData<DbContextTransaction>(CONTEXT_TRAN_KEY);
            if (tran == null)
            {
                tran = dc.Database.BeginTransaction(level);
                ContextStorage.SetData<DbContextTransaction>(CONTEXT_TRAN_KEY, tran);
                ContextStorage.SetData<int>(CONTEXT_TRAN_COUNT_KEY, 0);
            }
            else
            {
                int c = ContextStorage.GetData<int>(CONTEXT_TRAN_COUNT_KEY) + 1;
                ContextStorage.SetData<int>(CONTEXT_TRAN_COUNT_KEY, c);
            }
        }
        /// <summary>
        /// 提交上下文事务
        /// </summary>
        public static void Commit()
        {
            DbContextTransaction tran = ContextStorage.GetData<DbContextTransaction>(CONTEXT_TRAN_KEY);
            if (tran == null)
            {
                throw new DataException("当前上下文中不存在事务！");
            }
            int c = ContextStorage.GetData<int>(CONTEXT_TRAN_COUNT_KEY);
            if (c > 0)
            {
                ContextStorage.SetData<int>(CONTEXT_TRAN_COUNT_KEY, c - 1);
            }
            else
            {
                tran.Commit();
                ContextStorage.ClearData(CONTEXT_TRAN_KEY);
            }
        }
        /// <summary>
        /// 回滚上下文事务
        /// </summary>
        public static void Rollback()
        {
            try
            {
                DbContextTransaction tran = ContextStorage.GetData<DbContextTransaction>(CONTEXT_TRAN_KEY);
                if (tran == null)
                {
                    throw new DataException("当前上下文中不存在事务！");
                }
                tran.Rollback();
            }
            catch
            {
                throw;
            }
            finally
            {
                ContextStorage.ClearData(CONTEXT_TRAN_KEY);
                ContextStorage.ClearData(CONTEXT_TRAN_COUNT_KEY);
            }
        }
        #endregion

        [System.Data.Entity.DbFunctionAttribute("LeiFengModel", "Round2")]
        public static decimal Round2(decimal Val)
        {
            throw new NotSupportedException("Direct calls are not supported.");
        }
    }
}
