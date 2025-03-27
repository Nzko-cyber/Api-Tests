import {spec} from 'pactum';

const BASE_URL = 'https://phoenix-dev.datamicron.com/api/bi/api/Dashboard';


const EXCLUDED_ID = '690e7278-39bb-40e3-bfa7-69e998dab45a';

export async function deleteAllDashboardsExcept(projectId: string) {
    try {
        // 1. Получаем все Dashboard'ы
        const response = await new Promise((resolve, reject) => {
            let responseData: any = null;

            spec()
                .get(BASE_URL)
                .withHeaders({'ProjectId': projectId})
                .toss(); // Убираем параметры

            setTimeout(() => {
                if (responseData) {
                    resolve(responseData);
                } else {
                    reject({error: true, message: 'No response received'});
                }
            }, 500);
        });

        if (!response || !Array.isArray(response)) {
            console.error('❌ Unexpected response format:', response);
            return;
        }

        // 2. Фильтруем, оставляя только те, которые можно удалить
        const dashboardsToDelete = response.filter(dashboard => dashboard.id !== EXCLUDED_ID);

        if (dashboardsToDelete.length === 0) {
            console.log('✅ No dashboards to delete.');
            return;
        }

        // 3. Удаляем все отфильтрованные Dashboard'ы
        for (const dashboard of dashboardsToDelete) {
            await new Promise((resolve) => {
                spec()
                    .delete(`${BASE_URL}?id=${dashboard.id}`)
                    .withHeaders({'ProjectId': projectId})
                    .toss(); // Убрали параметры

                setTimeout(() => {
                    console.log(`🗑️ Deleted Dashboard: ${dashboard.id}`);
                    resolve(true);
                }, 500); // Даем API время выполнить запрос
            });
        }

        console.log('✅ All dashboards (except the excluded one) have been deleted.');
    } catch (error) {
        console.error('❌ Error deleting dashboards:', error);
    }
}

const projectId = '5c5c800c-ac58-464c-91cc-cff7a3a0f3d1';

(async () => {
    await deleteAllDashboardsExcept(projectId);
})();
